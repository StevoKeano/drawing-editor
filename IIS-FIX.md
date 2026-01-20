# IIS Deployment Fix for Drawing Editor

## Problem
Drawing tools work in development but not in IIS deployment - only initial shapes appear, no drag interaction.

## Root Cause
1. **CORS/Security Headers**: COEP/COOP headers block canvas interaction
2. **Pointer Events**: IIS handles mouse events differently
3. **Rendering Issues**: Konva needs specific rendering flags for IIS

## Solution Applied

### 1. Updated web.config
```xml
<httpProtocol>
  <customHeaders>
    <!-- Remove restrictive headers -->
    <remove name="Cross-Origin-Embedder-Policy" />
    <remove name="Cross-Origin-Opener-Policy" />
    <!-- Add permissive CORS -->
    <add name="Access-Control-Allow-Origin" value="*" />
  </customHeaders>
</httpProtocol>
```

### 2. Enhanced Canvas Event Handling
- Added `onMouseLeave={handleMouseUp}` to handle lost pointer events
- Added null checks for `getPointerPosition()`
- Added `perfectDrawEnabled: true` for IIS rendering
- Added `shadowForStrokeEnabled: false` for performance

### 3. Deployment Instructions
1. Copy entire `dist/` folder to IIS virtual directory `/drawing-editor/`
2. Ensure URL Rewrite module is installed
3. Test at `http://yourserver/drawing-editor/`

## Expected Result
- Rectangle tool: Click and drag creates rectangles
- Circle tool: Click and drag creates circles  
- Line tool: Click and drag creates lines
- All shapes respond to mouse movement during draw

## Debug Steps if Issues Persist
1. Open browser dev tools on IIS site
2. Check Console for JavaScript errors
3. Check Network tab for 404 errors
4. Verify web.config is being applied (check IIS response headers)