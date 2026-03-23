import json

# Read the zh.json file
with open('src/i18n/locales/zh.json', 'r', encoding='utf-8') as f:
    data = json.loads(f.read().replace('"完成创建"', '\\"完成创建\\"'))

# Write back properly formatted JSON
with open('src/i18n/locales/zh.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)