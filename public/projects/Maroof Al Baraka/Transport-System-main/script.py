import re

with open('temp.css', 'r', encoding='utf-8') as f:
    css = f.read()

path = 'resources/views/landing.blade.php'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

content = re.sub(r'<style>.*?</style>', '<style>\n' + css + '\n</style>', content, flags=re.DOTALL)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
print('Done!')
