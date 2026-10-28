

    // State variables
    let img = null;
	let activeTool = 'rect'; // 'rect' | 'circle'
	let shapes = [];
	let selectedShapeId = null;
	
	// Interaction state
	let isInteracting = false;
	let startX = 0, startY = 0;
	let activeAction = null; // 'draw', 'move', 'resize-nw', etc.
	let dragOffset = { x: 0, y: 0 };
	let initialShapeState = null;
	
	// Elements
	const canvas = document.getElementById('mainCanvas');
	const ctx = canvas.getContext('2d');
	const canvasParent = document.getElementById('canvasParent');
	const placeholder = document.getElementById('noImagePlaceholder');
	const extractBtn = document.getElementById('extractBtn');
	const resultSection = document.getElementById('resultSection');
	const jsonOutput = document.getElementById('jsonOutput');
	const pixelCountSpan = document.getElementById('pixelCount');
	
	const HANDLE_SIZE = 8; // Size of resize handles
	
	// Image Upload
	document.getElementById('imageInput').addEventListener('change', function(e) {
		const file = e.target.files[0];
		if (!file) return;
		
		const reader = new FileReader();
		reader.onload = function(evt) {
			img = new Image();
			img.onload = function() {
				setupCanvas();
				shapes = [];
				selectedShapeId = null;
				// resultSection.classList.add('hidden');
				extractBtn.disabled = false;
				render();
				updateShapesList();
				showToast('Image Uploaded');
			};
			img.src = evt.target.result;
		};
		reader.readAsDataURL(file);
	});
	
	// Responsive Canvas
	function setupCanvas() {
		if (!img) return;
		placeholder.classList.add('hidden');
		canvas.classList.remove('hidden');
		
		const pWidth = canvasParent.clientWidth - 32;
		const pHeight = Math.max(400, window.innerHeight - 200);
		
		const scale = Math.min(pWidth / img.width, pHeight / img.height);
		canvas.width = img.width * scale;
		canvas.height = img.height * scale;
		render();
	}
	
	window.addEventListener('resize', () => {
		if (img) setupCanvas();
	});
		
		// Active Tool Switcher
		function setShapeType(type) {
			activeTool = type;
			document.querySelectorAll('.tool-btn').forEach(b => {
				b.classList.remove('active', 'bg-gray-700', 'border-indigo-500', 'text-white');
				b.classList.add('bg-gray-900', 'border-gray-700', 'text-gray-300');
			});
			const btn = document.getElementById(`tool-${type}`);
			btn.classList.add('active', 'bg-gray-700', 'border-indigo-500', 'text-white');
			btn.classList.remove('bg-gray-900', 'border-gray-700', 'text-gray-300');
		}
		
		// Canvas Coordinates Helper
		function getCanvasCoords(e) {
			const rect = canvas.getBoundingClientRect();
			const clientX = e.touches ? e.touches[0].clientX : e.clientX;
			const clientY = e.touches ? e.touches[0].clientY : e.clientY;
			return {
				x: clientX - rect.left,
				y: clientY - rect.top
			};
		}
		
		// Pointer / Touch Events
		canvas.addEventListener('mousedown', handleStart);
		canvas.addEventListener('touchstart', handleStart, { passive: false });
		
		window.addEventListener('mousemove', handleMove);
		window.addEventListener('touchmove', handleMove, { passive: false });
		
		window.addEventListener('mouseup', handleEnd);
		window.addEventListener('touchend', handleEnd);
		
		// Key Listeners for Deleting shapes
		window.addEventListener('keydown', (e) => {
			if ((e.key === 'Delete' || e.key === 'Backspace') && selectedShapeId !== null) {
				// Ensure user is not typing in textarea
				if (document.activeElement.tagName !== 'TEXTAREA' && document.activeElement.tagName !== 'INPUT') {
					deleteShape(null, selectedShapeId);
				}
			}
		});
		
		function handleStart(e) {
			if (!img) return;
			const pos = getCanvasCoords(e);
			startX = pos.x;
			startY = pos.y;
			isInteracting = true;
			
			// 1. Check if clicking on resize handles of current selected shape
			if (selectedShapeId !== null) {
				const selShape = shapes.find(s => s.id === selectedShapeId);
				if (selShape) {
					const handle = getHitHandle(selShape, pos.x, pos.y);
					if (handle) {
						activeAction = `resize-${handle}`;
						initialShapeState = { ...selShape };
						return;
					}
				}
			}
			
			// 2. Check if clicking inside ANY existing shape (Top-most shape first)
			let hitShape = null;
			for (let i = shapes.length - 1; i >= 0; i--) {
				if (isPointInShape(shapes[i], pos.x, pos.y)) {
					hitShape = shapes[i];
					break;
				}
			}
			
			if (hitShape) {
				// Select and prepare to move
				selectedShapeId = hitShape.id;
				activeAction = 'move';
				dragOffset = {
					x: pos.x - hitShape.x,
					y: pos.y - hitShape.y
				};
			} else {
				// 3. Clicked in empty area: Deselect and start drawing a NEW shape
				selectedShapeId = null;
				const newId = Date.now();
				const newShape = {
					id: newId,
					type: activeTool,
					x: startX,
					y: startY,
					w: 1,
					h: 1,
					r: 1
				};
				shapes.push(newShape);
				selectedShapeId = newId;
				activeAction = 'draw';
			}
			
			updateShapesList();
			render();
		}
		
		function handleMove(e) {
			if (!isInteracting || !activeAction) return;
			if (e.cancelable) e.preventDefault();
			
			const pos = getCanvasCoords(e);
			const activeShape = shapes.find(s => s.id === selectedShapeId);
			if (!activeShape) return;
			
			if (activeAction === 'draw') {
				if (activeShape.type === 'rect') {
					activeShape.x = Math.min(startX, pos.x);
					activeShape.y = Math.min(startY, pos.y);
					activeShape.w = Math.abs(pos.x - startX);
					activeShape.h = Math.abs(pos.y - startY);
				} else if (activeShape.type === 'circle') {
					activeShape.x = startX;
					activeShape.y = startY;
					activeShape.r = Math.hypot(pos.x - startX, pos.y - startY);
				}
			} else if (activeAction === 'move') {
				activeShape.x = pos.x - dragOffset.x;
				activeShape.y = pos.y - dragOffset.y;
			} else if (activeAction.startsWith('resize-')) {
				const handle = activeAction.split('-')[1];
				resizeShape(activeShape, handle, pos);
			}
			
			updateCursor(pos);
			render();
		}
		
		function handleEnd() {
			if (!isInteracting) return;
			isInteracting = false;
			
			// Remove accidental tiny clicks during draw
			if (activeAction === 'draw') {
				const s = shapes.find(item => item.id === selectedShapeId);
				if (s && ((s.type === 'rect' && (s.w < 5 || s.h < 5)) || (s.type === 'circle' && s.r < 3))) {
					shapes = shapes.filter(item => item.id !== selectedShapeId);
					selectedShapeId = null;
				}
				updateShapesList();
			}
			activeAction = null;
			render();
		}
		
		// Dynamic Cursor Updates on Hover
		canvas.addEventListener('mousemove', (e) => {
			if (isInteracting || !img) return;
			const pos = getCanvasCoords(e);
			updateCursor(pos);
		});
		
		function updateCursor(pos) {
			if (selectedShapeId !== null) {
				const selShape = shapes.find(s => s.id === selectedShapeId);
				if (selShape && getHitHandle(selShape, pos.x, pos.y)) {
					canvas.style.cursor = 'nwse-resize';
					return;
				}
			}
			
			for (let i = shapes.length - 1; i >= 0; i--) {
				if (isPointInShape(shapes[i], pos.x, pos.y)) {
					canvas.style.cursor = 'move';
					return;
				}
			}
			canvas.style.cursor = 'crosshair';
		}
		
		// Shape Resize Logic
		function resizeShape(shape, handle, pos) {
			if (shape.type === 'rect') {
				let right = initialShapeState.x + initialShapeState.w;
				let bottom = initialShapeState.y + initialShapeState.h;
				
				if (handle.includes('e')) right = pos.x;
				if (handle.includes('w')) shape.x = Math.min(pos.x, right - 10);
				if (handle.includes('s')) bottom = pos.y;
				if (handle.includes('n')) shape.y = Math.min(pos.y, bottom - 10);
				
				shape.w = Math.max(10, right - shape.x);
				shape.h = Math.max(10, bottom - shape.y);
			} else if (shape.type === 'circle') {
				shape.r = Math.max(5, Math.hypot(pos.x - shape.x, pos.y - shape.y));
			}
		}
		
		// Hit Tests
		function isPointInShape(shape, x, y) {
			if (shape.type === 'rect') {
				return x >= shape.x && x <= shape.x + shape.w && y >= shape.y && y <= shape.y + shape.h;
			} else if (shape.type === 'circle') {
				return Math.hypot(x - shape.x, y - shape.y) <= shape.r;
			}
			return false;
		}
		
		function getHitHandle(shape, x, y) {
			const handles = getHandles(shape);
			for (const h of handles) {
				if (Math.abs(x - h.x) <= HANDLE_SIZE && Math.abs(y - h.y) <= HANDLE_SIZE) {
					return h.name;
				}
			}
			return null;
		}
		
		function getHandles(shape) {
			if (shape.type === 'rect') {
				return [
					{ name: 'nw', x: shape.x, y: shape.y },
					{ name: 'ne', x: shape.x + shape.w, y: shape.y },
					{ name: 'se', x: shape.x + shape.w, y: shape.y + shape.h },
					{ name: 'sw', x: shape.x, y: shape.y + shape.h }
				];
			} else if (shape.type === 'circle') {
				return [
					{ name: 'se', x: shape.x + shape.r, y: shape.y },
					{ name: 'nw', x: shape.x - shape.r, y: shape.y },
					{ name: 'sw', x: shape.x, y: shape.y + shape.r },
					{ name: 'ne', x: shape.x, y: shape.y - shape.r }
				];
			}
			return [];
		}
		
		// Rendering Pipeline
		function render() {
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			
			// 1. Draw Background Image
			if (img) {
				ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
			}
			
			// 2. Render all shapes
			shapes.forEach(shape => {
				const isSelected = (shape.id === selectedShapeId);
				
				ctx.save();
				ctx.lineWidth = isSelected ? 2.5 : 1.5;
				ctx.strokeStyle = isSelected ? '#6366f1' : '#10b981';
			ctx.fillStyle = isSelected ? 'rgba(99, 102, 241, 0.25)' : 'rgba(16, 185, 129, 0.15)';
			
			if (shape.type === 'rect') {
				ctx.beginPath();
				ctx.rect(shape.x, shape.y, shape.w, shape.h);
				ctx.fill();
				ctx.stroke();
			} else if (shape.type === 'circle') {
				ctx.beginPath();
				ctx.arc(shape.x, shape.y, shape.r, 0, Math.PI * 2);
				ctx.fill();
				ctx.stroke();
			}
			
			// Render Resize Handles ONLY for Selected Object
			if (isSelected) {
				const handles = getHandles(shape);
				ctx.fillStyle = '#ffffff';
			ctx.strokeStyle = '#4f46e5';
			ctx.lineWidth = 2;
			
			handles.forEach(h => {
				ctx.beginPath();
				ctx.arc(h.x, h.y, HANDLE_SIZE / 1.5, 0, Math.PI * 2);
				ctx.fill();
				ctx.stroke();
			});
			}
			ctx.restore();
			});
		}
		
		// Sidebar List Helper
		function updateShapesList() {
			const container = document.getElementById('shapesList');
			if (shapes.length === 0) {
				container.innerHTML = '<p class="text-xs text-gray-500 text-center py-4">NO Selected Parts yet!!</p>';
				return;
			}
			
			container.innerHTML = shapes.map((s, idx) => `
			<div onclick="selectShapeFromList(${s.id})" class="flex items-center justify-between p-2 rounded-lg text-xs cursor-pointer transition ${s.id === selectedShapeId ? 'bg-indigo-600/30 border border-indigo-500 text-white font-bold' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}">
			<div class="flex items-center gap-2">
			<i class="fa-regular ${s.type === 'rect' ? 'fa-square' : 'fa-circle'} text-indigo-400"></i>
			<span>#${idx + 1}</span>
			</div>
			<button onclick="deleteShape(event, ${s.id})" class="text-gray-500 hover:text-red-400 p-1" title="delete">
			<i class="fa-solid fa-xmark"></i>
			</button>
			</div>
			`).join('');
		}
		
		function selectShapeFromList(id) {
			selectedShapeId = id;
			render();
			updateShapesList();
		}
		
		function deleteShape(e, id) {
			if (e) e.stopPropagation();
			shapes = shapes.filter(s => s.id !== id);
			if (selectedShapeId === id) selectedShapeId = null;
			render();
			updateShapesList();
		}
		
		function clearAllShapes() {
			shapes = [];
			selectedShapeId = null;
			render();
			updateShapesList();
			resultSection.classList.add('hidden');
		}
		
		// Confirm & Rasterize Unique Pixels in Original Image Scale
		function confirmAndExtractPixels() {
			if (!img || shapes.length === 0) {
				showToast('Select at least one part to encrypt it.', 'error');
				return;
			}
			
			const scaleX = img.width / canvas.width;
			const scaleY = img.height / canvas.height;
			
			// Set to ensure UNIQNESS of coordinates
			const pixelSet = new Set();
			
			shapes.forEach(shape => {
				if (shape.type === 'rect') {
					const origX = Math.round(shape.x * scaleX);
					const origY = Math.round(shape.y * scaleY);
					const origW = Math.round(shape.w * scaleX);
					const origH = Math.round(shape.h * scaleY);
					
					for (let x = origX; x < origX + origW; x++) {
						for (let y = origY; y < origY + origH; y++) {
							if (x >= 0 && x < img.width && y >= 0 && y < img.height) {
								pixelSet.add(`${x},${y}`);
							}
						}
					}
				} else if (shape.type === 'circle') {
					const origCenterX = Math.round(shape.x * scaleX);
					const origCenterY = Math.round(shape.y * scaleY);
					const origRadiusX = shape.r * scaleX;
					const origRadiusY = shape.r * scaleY;
					
					const minX = Math.max(0, Math.floor(origCenterX - origRadiusX));
					const maxX = Math.min(img.width - 1, Math.ceil(origCenterX + origRadiusX));
					const minY = Math.max(0, Math.floor(origCenterY - origRadiusY));
					const maxY = Math.min(img.height - 1, Math.ceil(origCenterY + origRadiusY));
					
					for (let x = minX; x <= maxX; x++) {
						for (let y = minY; y <= maxY; y++) {
							const normX = (x - origCenterX) / origRadiusX;
							const normY = (y - origCenterY) / origRadiusY;
							if (normX * normX + normY * normY <= 1) {
								pixelSet.add(`${x},${y}`);
							}
						}
					}
				}
			});
			
			// Convert set into JSON array
			const pixelArray = Array.from(pixelSet).map(coord => {
				const [x, y] = coord.split(',').map(Number);
				return { x, y };
			});
			
			// pixelCountSpan.textContent = pixelArray.length.toLocaleString('en');
			jsonOutput.value = JSON.stringify(pixelArray, null, 2);
			// resultSection.classList.remove('hidden');
			
			console.log(jsonOutput.value);
			// resultSection.scrollIntoView({ behavior: 'smooth' });
			// showToast(`تم استخراج ${pixelArray.length} بيكسل فريد بنجاح`);
		}
		
		// // Copy / Export JSON
		// function copyJSON() {
		// 	jsonOutput.select();
		// 	document.execCommand('copy');
		// 	showToast('تم نسخ مصفوفة البيكسلات إلى الحافظة');
		// }
		
		// function downloadJSON() {
		// 	const blob = new Blob([jsonOutput.value], { type: 'application/json' });
		// 	const url = URL.createObjectURL(blob);
		// 	const a = document.createElement('a');
		// 	a.href = url;
		// 	a.download = `pixels_${Date.now()}.json`;
		// 	a.click();
		// 	URL.revokeObjectURL(url);
		// 	showToast('تم تحميل ملف JSON بنجاح');
		// }
		
		// Notification Toast
		function showToast(message, type = 'success') {
			const toast = document.getElementById('toast');
			const toastMsg = document.getElementById('toastMsg');
			const toastIcon = document.getElementById('toastIcon');
			
			toastMsg.textContent = message;
			if (type === 'error') {
				toastIcon.className = 'fa-solid fa-circle-exclamation text-red-400';
			} else {
				toastIcon.className = 'fa-solid fa-circle-check text-emerald-400';
			}
			
			toast.classList.remove('translate-y-20', 'opacity-0');
			setTimeout(() => {
				toast.classList.add('translate-y-20', 'opacity-0');
			}, 3000);
		}
