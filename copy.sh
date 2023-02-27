#!/bin/bash
###
 # @Descripttion: 
 # @version: 1.0.0
 # @Author: 袁婕轩
 # @Date: 2021-05-08 09:24:52
 # @LastEditors: 袁婕轩
 # @LastEditTime: 2021-07-13 15:32:47
### 
echo "start to cp"

if [ ! -d "../../../project-server/tiklab-teamwire/tiklab-teamwire-starter/src/main/resources/static/" ];
then
    echo "文件不存在"
    else
        echo "删除文件"
        rm -rf ../../../project-server/tiklab-teamwire/tiklab-teamwire-starter/src/main/resources/static
fi

cp -r ./dist/* ../../../tiklab-teamwire-ui/tiklab-teamwire-web/plugin/
killall $!
echo "拷贝完成"