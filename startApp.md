Here are the commands to start and stop your VerseNotes application:

## 🚀 **Start the Application**

### **Option 1: Start with port selection (recommended)**
```bash
npx expo start --clear
```
- This clears the cache and asks which port to use
- Choose `Y` when it asks about using a different port (8082, 8083, etc.)

### **Option 2: Start on specific port**
```bash
npx expo start --clear --port 8082
```

### **Option 3: Start for specific platform**
```bash
# For web browser
npx expo start --web

# For Android
npx expo start --android

# For iOS
npx expo start --ios
```

## 🛑 **Stop the Application**

### **Option 1: Stop with Ctrl+C (most common)**
```bash
# In the terminal where Expo is running
Ctrl + C
```

### **Option 2: Kill the process**
```bash
# Find the process
lsof -ti:8082

# Kill it (replace PID with the actual process ID)
kill -9 <PID>
```

### **Option 3: Kill all Expo processes**
```bash
# Kill all Node.js processes (be careful if you have other Node apps)
pkill -f "expo"
```

## 📱 **Access the Application**

Once started, you can access it via:
- **Web Browser**: `http://localhost:8082` (or whatever port it's using)
- **Mobile**: Scan the QR code with Expo Go app
- **Android Emulator**: Press `a` in the terminal
- **iOS Simulator**: Press `i` in the terminal

## 🔄 **Restart the Application**

If you make changes to the code:
```bash
# Stop with Ctrl+C, then restart
npx expo start --clear
```

Or just press `r` in the terminal to reload without restarting.

## 📋 **Current Status**

Your app is currently running on **port 8082**. You can:
1. **Open in browser**: Go to `http://localhost:8082`
2. **Test the Bible search**: Try "John 3:16" or "Romans 1:1-16"
3. **Stop when done**: Press `Ctrl + C` in the terminal

The app should now work perfectly with your Crossway ESV API key!