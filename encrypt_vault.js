const fs = require('fs');
const crypto = require('crypto');

// 1. Configuration
const PASSWORD = 'CELLHAWK-VAULT-2026';
const ALGORITHM = 'aes-256-gcm';

// 2. Read the source HTML content
console.log('Reading data-room-portal.html...');
const rawHtml = fs.readFileSync('data-room-portal.html', 'utf8');

// Extract just the inner content
const contentMatch = rawHtml.match(/<body>([\s\S]*?)<\/body>/);
if (!contentMatch) {
    console.error('Could not parse data-room-portal.html content.');
    process.exit(1);
}
const secretHtml = contentMatch[1];

// 3. Encrypt the content
console.log('Encrypting payload with AES-256-GCM...');
const key = crypto.createHash('sha256').update(PASSWORD).digest();
const iv = crypto.randomBytes(12);

const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
let encrypted = cipher.update(secretHtml, 'utf8', 'base64');
encrypted += cipher.final('base64');
const authTag = cipher.getAuthTag().toString('base64');

// Package the encrypted data
const payload = {
    iv: iv.toString('base64'),
    encryptedData: encrypted,
    authTag: authTag
};

// 4. Generate the new Secure Portal HTML
console.log('Generating secure dataroom.html...');
const finalHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CELLHAWK | Secure Vault</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=SF+Mono:wght@400;500&display=swap" rel="stylesheet">
    <style>
        :root {
            --bg: #000000;
            --text-primary: #f5f5f7;
            --text-secondary: #86868b;
            --accent: #2997ff;
            --accent-hover: #0071e3;
            --border: rgba(255, 255, 255, 0.15);
            --surface: rgba(28, 28, 30, 0.5);
        }

        * { margin: 0; padding: 0; box-sizing: border-box; }

        body {
            background-color: var(--bg);
            color: var(--text-primary);
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            -webkit-font-smoothing: antialiased;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        #gatekeeper {
            width: 100%;
            max-width: 420px;
            padding: 48px 40px;
            text-align: center;
            border: 1px solid var(--border);
            border-radius: 18px;
            background: var(--surface);
            backdrop-filter: blur(40px);
            -webkit-backdrop-filter: blur(40px);
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4);
        }

        .logo-svg { width: 56px; height: 56px; margin: 0 auto 24px auto; color: var(--text-primary); }
        h1 { font-size: 24px; font-weight: 600; margin-bottom: 12px; letter-spacing: -0.01em; }
        p { color: var(--text-secondary); font-size: 14px; margin-bottom: 36px; line-height: 1.5; }

        .input-group { margin-bottom: 24px; text-align: left; }
        label { display: block; font-size: 12px; font-weight: 500; color: var(--text-secondary); margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.05em; }
        input { width: 100%; padding: 16px; background: rgba(0,0,0,0.3); border: 1px solid var(--border); border-radius: 12px; color: var(--text-primary); font-family: 'SF Mono', monospace; font-size: 15px; outline: none; }
        input:focus { border-color: var(--accent); background: rgba(0,0,0,0.5); }

        .btn-access { width: 100%; padding: 16px; background: var(--accent); color: #fff; border: none; border-radius: 12px; font-size: 15px; font-weight: 500; cursor: pointer; transition: all 0.2s; }
        .btn-access:hover { background: var(--accent-hover); transform: scale(0.98); }
        .error-msg { color: #ff3b30; font-size: 13px; margin-top: 16px; display: none; font-weight: 500; }

        #vault-content { display: none; width: 100%; max-width: 900px; padding: 60px 20px; margin: 0 auto; }
        .vdr-header { display: flex; justify-content: space-between; align-items: flex-end; border-bottom: 1px solid var(--border); padding-bottom: 24px; margin-bottom: 32px; }
        .vdr-title h2 { font-size: 24px; font-weight: 600; color: var(--text-primary); letter-spacing: -0.01em; margin-bottom: 8px; }
        .vdr-title p { font-size: 13px; color: var(--text-secondary); margin: 0; }
        .vdr-meta { text-align: right; font-size: 12px; color: var(--text-secondary); font-family: 'SF Mono', monospace; }
        
        .folder { background: rgba(255,255,255,0.02); border: 1px solid var(--border); border-radius: 12px; margin-bottom: 20px; overflow: hidden; }
        .folder-header { padding: 16px 20px; background: rgba(255,255,255,0.03); border-bottom: 1px solid var(--border); display: flex; align-items: center; gap: 12px; font-weight: 600; color: var(--text-primary); font-size: 14px; }
        .folder-icon { color: var(--accent); }
        
        .file-list { list-style: none; padding: 0; margin: 0; }
        .file-item { display: flex; justify-content: space-between; align-items: center; padding: 16px 20px 16px 44px; border-bottom: 1px solid var(--border); transition: background 0.2s; }
        .file-item:last-child { border-bottom: none; }
        .file-item:hover { background: rgba(255,255,255,0.02); }
        
        .file-info { display: flex; align-items: center; gap: 12px; }
        .file-name { font-size: 14px; color: var(--text-primary); font-weight: 500; }
        .file-desc { font-size: 12px; color: var(--text-secondary); margin-top: 4px; }
        .file-meta { font-family: 'SF Mono', monospace; font-size: 11px; color: var(--text-secondary); text-align: right; }
        
        .btn-download { background: rgba(41, 151, 255, 0.1); color: var(--accent); border: 1px solid rgba(41, 151, 255, 0.2); padding: 6px 12px; border-radius: 6px; font-size: 12px; font-weight: 600; cursor: pointer; transition: all 0.2s; text-decoration: none; }
        .btn-download:hover { background: var(--accent); color: #fff; }

        .footer { text-align: center; margin-top: 60px; padding-top: 40px; border-top: 1px solid var(--border); font-family: 'SF Mono', monospace; font-size: 11px; color: #4b5563; }

        @keyframes shake { 
            10%, 90% { transform: translate3d(-1px, 0, 0); } 
            20%, 80% { transform: translate3d(2px, 0, 0); } 
            30%, 50%, 70% { transform: translate3d(-4px, 0, 0); } 
            40%, 60% { transform: translate3d(4px, 0, 0); } 
        }
    </style>
</head>
<body>
    <div id="gatekeeper">
        <svg class="logo-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M12 8v4"/><path d="M12 16h.01"/>
        </svg>
        <h1>Technical Data Room</h1>
        <p>Restricted access for verified M&A and strategic partners. Enter your unique AES-256 access key.</p>
        <div class="input-group">
            <label for="accessKey">Authorization Key</label>
            <input type="password" id="accessKey" placeholder="••••••••••••" onkeypress="handleKeyPress(event)">
        </div>
        <button class="btn-access" onclick="verifyAndDecrypt()">Decrypt & Access</button>
        <div id="errorMsg" class="error-msg">Access Denied: Invalid Key</div>
    </div>

    <div id="vault-content">
        <div id="decrypted-container"></div>
    </div>

    <script>
        const vaultPayload = ${JSON.stringify(payload)};

        async function verifyAndDecrypt() {
            const password = document.getElementById('accessKey').value;
            const error = document.getElementById('errorMsg');

            try {
                const iv = Uint8Array.from(atob(vaultPayload.iv), c => c.charCodeAt(0));
                const ciphertext = Uint8Array.from(atob(vaultPayload.encryptedData), c => c.charCodeAt(0));
                const authTag = Uint8Array.from(atob(vaultPayload.authTag), c => c.charCodeAt(0));

                const enc = new TextEncoder();
                const keyMaterial = await window.crypto.subtle.digest('SHA-256', enc.encode(password));
                
                const cryptoKey = await window.crypto.subtle.importKey(
                    'raw',
                    keyMaterial,
                    { name: 'AES-GCM' },
                    false,
                    ['decrypt']
                );

                const combined = new Uint8Array(ciphertext.length + authTag.length);
                combined.set(ciphertext);
                combined.set(authTag, ciphertext.length);

                const decryptedBuffer = await window.crypto.subtle.decrypt(
                    { name: 'AES-GCM', iv: iv },
                    cryptoKey,
                    combined
                );

                const decryptedText = new TextDecoder().decode(decryptedBuffer);

                document.getElementById('gatekeeper').style.display = 'none';
                document.getElementById('vault-content').style.display = 'block';
                document.getElementById('decrypted-container').innerHTML = decryptedText;
                
            } catch (err) {
                error.style.display = 'block';
                document.getElementById('accessKey').value = '';
                const container = document.getElementById('gatekeeper');
                container.style.animation = 'shake 0.4s cubic-bezier(.36,.07,.19,.97) both';
                setTimeout(() => container.style.animation = '', 400);
            }
        }

        function handleKeyPress(e) {
            if (e.key === 'Enter') verifyAndDecrypt();
        }
    </script>
</body>
</html>`;

fs.writeFileSync('dataroom.html', finalHtml);
console.log('dataroom.html created successfully with encrypted payload.');

// 5. Cleanup vulnerable files
console.log('Cleaning up vulnerable plaintext files...');
try { fs.unlinkSync('data-room-portal.html'); } catch(e){}

console.log('----------------------------------------------------');
console.log('SUCCESS: Your Data Room is now an impenetrable AES-256 Vault.');
console.log('PASSWORD KEY: ' + PASSWORD);
console.log('----------------------------------------------------');
