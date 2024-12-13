import os

def gather_code(project_root, output_file, extensions=None, exclude_dirs=None):
    if extensions is None:
        # Common web and backend file extensions. Adjust as needed.
        extensions = ['.js', '.jsx', '.ts', '.tsx', '.py', '.html', '.css', '.scss', '.json']
    if exclude_dirs is None:
        # Directories to exclude
        exclude_dirs = ['node_modules', 'dist', 'build', 'coverage']
        
    with open(output_file, 'w', encoding='utf-8') as out_f:
        for root, dirs, files in os.walk(project_root):
            # Modify dirs in-place to skip excluded directories
            dirs[:] = [d for d in dirs if d not in exclude_dirs]

            for file in files:
                ext = os.path.splitext(file)[1].lower()
                if ext in extensions:
                    file_path = os.path.join(root, file)
                    relative_path = os.path.relpath(file_path, project_root)
                    
                    # Write a file header
                    out_f.write(f"\n\n{'='*80}\n")
                    out_f.write(f"File: {relative_path}\n")
                    out_f.write(f"{'='*80}\n\n")

                    # Write file content
                    with open(file_path, 'r', encoding='utf-8', errors='replace') as in_f:
                        code = in_f.read()
                        out_f.write(code)
                    out_f.write("\n")

if __name__ == "__main__":
    # Update this with your actual project root path
    project_root = r"C:\OceanKart"
    output_file = "combined_code"
    
    # Gather all relevant code files into one output file, excluding certain directories
    gather_code(project_root, output_file)
    print(f"All code has been combined into: {output_file}")
