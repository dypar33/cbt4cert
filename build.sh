#!/bin/bash

echo "🚀 CBT4Cert 빌드 시작..."

# docs/data 폴더가 존재하면 백업
if [ -d "docs/data" ]; then
    echo "📦 docs/data 폴더 백업 중..."
    cp -r docs/data temp_data_backup
fi

# Vite 빌드 실행
echo "🔨 Vite 빌드 실행 중..."
npm run build

# 빌드가 성공했는지 확인
if [ $? -eq 0 ]; then
    echo "✅ Vite 빌드 완료"
    
    # 백업된 data 폴더가 있으면 복원
    if [ -d "temp_data_backup" ]; then
        echo "📂 docs/data 폴더 복원 중..."
        mkdir -p docs/data
        cp -r temp_data_backup/* docs/data/
        rm -rf temp_data_backup
        echo "✅ docs/data 폴더 복원 완료"
    fi
    
    echo "🎉 빌드 완료! docs 폴더에 배포 파일이 생성되었습니다."
else
    echo "❌ 빌드 실패"
    
    # 실패 시 백업 폴더 정리
    if [ -d "temp_data_backup" ]; then
        rm -rf temp_data_backup
    fi
    
    exit 1
fi
