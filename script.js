const htmlEditor = document.getElementById('htmlEditor');
const cssEditor = document.getElementById('cssEditor');
const jsEditor = document.getElementById('jsEditor');
const outputContainer = document.getElementById('outputContainer');
const outputFrame = document.getElementById('output');

// Load saved code from local storage
window.onload = function () {
    document.getElementById('html').value = localStorage.getItem('htmlCode') || '';
    document.getElementById('css').value = localStorage.getItem('cssCode') || '';
    document.getElementById('js').value = localStorage.getItem('jsCode') || '';
    showEditor('html');
    addAutoCompleteFeatures();
    enableAutoSave(); // Enable auto-save
};

// Function to switch between editors
function showEditor(type) {
    htmlEditor.style.display = 'none';
    cssEditor.style.display = 'none';
    jsEditor.style.display = 'none';

    document.getElementById('htmlBtn').classList.remove('active');
    document.getElementById('cssBtn').classList.remove('active');
    document.getElementById('jsBtn').classList.remove('active');

    document.getElementById(type + 'Editor').style.display = 'block';
    document.getElementById(type + 'Btn').classList.add('active');
}

// Save code to local storage
function saveCode() {
    localStorage.setItem('htmlCode', document.getElementById('html').value);
    localStorage.setItem('cssCode', document.getElementById('css').value);
    localStorage.setItem('jsCode', document.getElementById('js').value);
    alert('Code saved successfully!');
}

// Run code and display in iframe
function runCode() {
    const html = document.getElementById('html').value;
    const css = `<style>${document.getElementById('css').value}</style>`;
    const js = `<script>${document.getElementById('js').value}<\/script>`;
    outputFrame.srcdoc = html + css + js;

    document.querySelector('.codeBtn').style.display = 'none';
    document.querySelector('.codeBtn div').style.display = 'none';
    htmlEditor.style.display = 'none';
    cssEditor.style.display = 'none';
    jsEditor.style.display = 'none';
    outputContainer.style.display = 'flex';
}

// Go back to the editor
function goBack() {
    document.querySelector('.codeBtn').style.display = 'flex';
    document.querySelector('.codeBtn div').style.display = 'flex';
    outputContainer.style.display = 'none';
    showEditor('html');
}

// Enable auto-save for editors
function enableAutoSave() {
    const htmlTextarea = document.getElementById('html');
    const cssTextarea = document.getElementById('css');
    const jsTextarea = document.getElementById('js');

    const autoSave = (textarea, key) => {
        textarea.addEventListener('input', () => {
            localStorage.setItem(key, textarea.value);
        });
    };

    autoSave(htmlTextarea, 'htmlCode');
    autoSave(cssTextarea, 'cssCode');
    autoSave(jsTextarea, 'jsCode');
}

// Add autocomplete features
function addAutoCompleteFeatures() {
    const htmlTextarea = document.getElementById('html');
    const cssTextarea = document.getElementById('css');
    const jsTextarea = document.getElementById('js');

    const autoClose = (textarea, openChar, closeChar) => {
        textarea.addEventListener('input', (e) => {
            const { value, selectionStart } = textarea;
            if (e.inputType === 'insertText' && e.data === openChar) {
                const beforeCursor = value.slice(0, selectionStart);
                const afterCursor = value.slice(selectionStart);
                textarea.value = `${beforeCursor}${closeChar}${afterCursor}`;
                textarea.selectionEnd = selectionStart;
            }
        });
    };

    const autoCloseTags = (textarea) => {
        textarea.addEventListener('input', (e) => {
            const { value, selectionStart } = textarea;
            if (e.inputType === 'insertText' && e.data === '>') {
                const beforeCursor = value.slice(0, selectionStart - 1);
                const afterCursor = value.slice(selectionStart);
                const match = beforeCursor.match(/<(\w+)$/);
                if (match) {
                    const tagName = match[1];
                    textarea.value = `${beforeCursor}></${tagName}>${afterCursor}`;
                    textarea.selectionEnd = selectionStart - 1;
                }
            }
        });
    };

    // Autocomplete for HTML
    autoClose(htmlTextarea, '"', '"');
    autoCloseTags(htmlTextarea);

    // Autocomplete for CSS
    autoClose(cssTextarea, '{', '}');
    autoClose(cssTextarea, ':', ' ;');

    // Autocomplete for JS
    autoClose(jsTextarea, '(', ')');
    autoClose(jsTextarea, '{', '}');
    autoClose(jsTextarea, '"', '"');
    autoClose(jsTextarea, "'", "'");
}