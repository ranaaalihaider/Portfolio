import codecs
import re

deleted_lines = []
in_diff = False
with open('recovery.txt', 'r', encoding='utf-8') as f:
    for line in f:
        line_clean = line.rstrip('\r\n')
        
        if '[diff_block_start]' in line_clean:
            in_diff = True
            continue
        if '[diff_block_end]' in line_clean:
            break
            
        if in_diff:
            if line_clean.startswith('@@'):
                continue
            if line_clean.startswith('-'):
                # it's a deleted line
                content = line_clean[1:]
                deleted_lines.append(content)
            elif line_clean == '-':
                # empty deleted line
                deleted_lines.append('')
            elif line_clean == '':
                # blank line might be due to weird formatting in diff print
                pass
            
with open(r'c:\Users\Ranaa Ali Haider\Desktop\Transport System\resources\views\landing.blade.php', 'r', encoding='utf-8') as f:
    current_lines = f.read().split('\n')

start_idx = 0
for i, l in enumerate(current_lines):
    if '<a href="#services">Our Services</a>' in l:
        start_idx = i
        break

remaining_lines = current_lines[start_idx:]

rebuilt = '\n'.join(deleted_lines) + '\n' + '\n'.join(remaining_lines)

with open(r'c:\Users\Ranaa Ali Haider\Desktop\Transport System\resources\views\landing.blade.php', 'w', encoding='utf-8') as f:
    f.write(rebuilt)
print('Rebuilt successfully!')
