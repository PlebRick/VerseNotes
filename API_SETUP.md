# Crossway ESV API Setup Guide

## 🔑 Getting Your Crossway ESV API Key

1. **Visit Crossway ESV API**: Go to [Crossway ESV API](https://api.esv.org/)
2. **Sign Up**: Create a free account
3. **Get API Key**: Navigate to your dashboard and copy your API key

## ⚙️ Configuration

1. **Edit .env file**: Open the `.env` file in the root directory
2. **Add your API key**: Replace `your-esv-api-key-here` with your actual API key:

```bash
BIBLE_API_KEY=your-actual-api-key-here
```

**Example:**
```bash
BIBLE_API_KEY=abc123def456ghi789jkl012mno345pqr678stu901vwx234yz
```

## 🔒 Security Notes

- ✅ The `.env` file is already added to `.gitignore` (won't be committed to Git)
- ✅ API key is loaded securely through Expo's environment system
- ✅ No hardcoded keys in the source code

## 🚀 Testing

After adding your API key:

1. **Restart the development server**:
   ```bash
   npx expo start --clear
   ```

2. **Test the search**: Try searching for "John 3:16" or "Romans 1:1-16"

3. **Check console**: If there are any issues, check the Metro bundler console for warnings

## 🐛 Troubleshooting

### "API Key Required" Alert
- Make sure you've added your API key to the `.env` file
- Restart the development server after editing `.env`
- Check that the `.env` file is in the root directory

### "Failed to load Bible passage" Error
- Verify your API key is correct
- Check your internet connection
- Ensure the Bible reference format is correct (e.g., "John 3:16")

### Console Warnings
- If you see "Bible API key not configured", double-check your `.env` file
- Make sure there are no extra spaces or quotes around your API key

## 📱 Supported Bible References

The app supports these formats:
- `John 3:16`
- `Romans 1:1-16`
- `Genesis 1`
- `Matthew 5:1-12`

## 🔗 API Documentation

For more information about the Crossway ESV API:
- [API Documentation](https://api.esv.org/docs)
- [Rate Limits](https://api.esv.org/docs/rate-limits)
- [ESV Bible](https://www.esv.org/) 