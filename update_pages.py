import os
import glob

pages_dir = r"c:\Users\Admin\OneDrive\Desktop\new 1\web-dashboard\src\pages"
files = glob.glob(os.path.join(pages_dir, "*.jsx"))

for file_path in files:
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()
    
    # Replace amber with cyan for the main accent color
    content = content.replace("var(--accent-amber)", "var(--accent-cyan)")
    content = content.replace("var(--accent-amber-glow)", "var(--accent-cyan-glow)")
    
    # In Camera.jsx, remove the D-PAD block
    if "Camera.jsx" in file_path:
        # Find the D-PAD section and remove it
        if "{/* D-PAD */}" in content:
            start_idx = content.find("{/* D-PAD */}")
            # find the end of the D-PAD div
            end_search = '<button style={{ width: \'100%\''
            end_idx = content.find(end_search, start_idx)
            
            if start_idx != -1 and end_idx != -1:
                content = content[:start_idx] + content[end_idx:]
                
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content)
        
print("Updated all pages.")
