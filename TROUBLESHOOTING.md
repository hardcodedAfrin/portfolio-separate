# Troubleshooting Guide

## Server is Running But Can't Access localhost:3000

The server is confirmed to be running. If you're getting "This site can't be reached", try these solutions:

### 1. Check the URL
Make sure you're using the correct URL format:
- ✅ **Correct**: `http://localhost:3000`
- ✅ **Correct**: `http://127.0.0.1:3000`
- ❌ **Wrong**: `localhost:3000adreess` (extra characters)
- ❌ **Wrong**: `https://localhost:3000` (use http, not https)

### 2. Clear Browser Cache
- Press `Ctrl + Shift + Delete` to clear browser cache
- Or try opening in an **Incognito/Private window**

### 3. Try Different Browsers
- Try Chrome, Firefox, Edge, or another browser
- Sometimes one browser has issues while others work

### 4. Check Windows Firewall
1. Open Windows Defender Firewall
2. Check if Node.js or your browser is being blocked
3. Temporarily disable firewall to test (enable it back after testing)

### 5. Check if Port 3000 is Actually Running
Open PowerShell and run:
```powershell
netstat -ano | findstr :3000
```

If you see output, the server is running. If not, restart the server:
```bash
npm start
```

### 6. Try a Different Port
If port 3000 is blocked, you can change it in `server.js`:
```javascript
const PORT = 3001; // or any other port
```

Then restart the server and access `http://localhost:3001`

### 7. Restart the Server
1. Stop the current server (Ctrl+C in the terminal)
2. Make sure no other process is using port 3000
3. Start again: `npm start`
4. Wait for the message: "✅ Server running on http://localhost:3000"

### 8. Check Browser Console
1. Open browser Developer Tools (F12)
2. Go to Console tab
3. Look for any JavaScript errors
4. Go to Network tab to see if requests are being made

### 9. Verify Server Output
When you run `npm start`, you should see:
```
📦 Database connection established
✅ Server running on http://localhost:3000
📄 Open http://localhost:3000 in your browser
```

If you see error messages instead, share them for troubleshooting.

### 10. Test Directly
Try accessing the API directly:
- Open: `http://localhost:3000/api/portfolio`
- You should see JSON data

If this works but the main page doesn't, it's a frontend issue.

## Still Having Issues?

1. Make sure you're running the server from the correct directory
2. Verify all dependencies are installed: `npm install`
3. Check if the database exists: `portfolio.db` file should be in the project folder
4. If database is missing, run: `npm run seed`

