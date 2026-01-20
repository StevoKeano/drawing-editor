# IIS Canvas Drawing Fix - Final Attempt

## Issue Diagnostics

The problem is that IIS handles JavaScript events differently than local dev. Let's deploy and debug step by step.

## Debug Steps

1. **Deploy current build to IIS**
2. **Open browser dev tools** on the IIS site
3. **Check Console tab** for:
   - Any JavaScript errors?
   - "🎨 Canvas Debug Helper Loading..." message?
   - Mouse event logs?

4. **Check Network tab** for:
   - Failed asset requests (404s)?
   - Response headers showing CORS restrictions?

## Expected Debug Output

If working, you should see:
```
🎨 Canvas Debug Helper Loading...
✅ Canvas found: <canvas>...
🖱️ Mousedown on canvas: MouseEvent
🖱️ Mouseup on canvas: MouseEvent
```

## If Still Broken - Try This

### Option 1: Manual Coordinate Calculation
Replace the Canvas component handleMouseDown with:

```typescript
const handleMouseDown = (e: any) => {
    // Direct coordinate calculation for IIS
    const stage = e.target.getStage();
    const containerRect = stage.container().getBoundingClientRect();
    
    const pos = {
        x: e.evt.clientX - containerRect.left,
        y: e.evt.clientY - containerRect.top
    };
    
    console.log('IIS coordinates:', pos);
    setStartPos(pos);
    // ... rest of the logic
};
```

### Option 2: Force Pointer Events
Add to Stage component:
```jsx
<Stage
    // ... existing props
    style={{ touchAction: 'none' }}
    preventDefault={false}
/>
```

### Option 3: IIS Configuration Fix
Add to web.config system.webServer:
```xml
<staticContent>
    <mimeMap fileExtension=".js" mimeType="text/javascript" />
    <mimeMap fileExtension=".mjs" mimeType="text/javascript" />
</staticContent>
```

## Test Instructions

1. Deploy the current build
2. Open the site in Chrome/Firefox
3. Open Dev Tools (F12)
4. Try drawing a rectangle
5. Check what appears in Console tab

Report back exactly what you see in the console - this will tell us if it's:
- Event handling (no mouse events)
- Coordinate calculation (events but wrong coords)  
- Rendering (events and coords but no visuals)