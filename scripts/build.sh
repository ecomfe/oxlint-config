#!/usr/bin/env bash

set -e

echo "node: $(node -v)"
echo "npm: $(npm -v)"

# 编译 TypeScript
npm install
npm run build

# 检查 dist 目录不为空
if [ ! -d "dist" ] || [ -z "$(ls -A dist)" ]; then
    echo "错误: dist 目录不存在或为空"
    exit 1
fi

# 创建 output 目录
mkdir -p output

# 复制文件到 output
cp -r dist output/
cp package.json output/
cp CHANGELOG.md output/
cp LICENSE output/
cp -r src output/

echo "finished"