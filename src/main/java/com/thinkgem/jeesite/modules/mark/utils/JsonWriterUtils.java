package com.thinkgem.jeesite.modules.mark.utils;

import com.alibaba.fastjson.JSON;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.DefaultResourceLoader;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;

import java.io.*;
import java.net.URLDecoder;

/**
 * Created by Administrator on 2016/11/30.
 */
public class JsonWriterUtils {

    public static String JSON_PATH = "/static/lottery";
    public static Logger logger = LoggerFactory.getLogger(JsonWriterUtils.class);


    public static String getRequestPath(String path) {
        ResourceLoader resourceLoader = new DefaultResourceLoader();
        Resource resource = resourceLoader.getResource("");
        try {
            String classPath = resource.getURL().getPath();
            if (classPath.startsWith("/")) {
                classPath = classPath.substring(1);
            }
            classPath = classPath.substring(0, classPath.indexOf("/WEB-INF/"));
            path = URLDecoder.decode(classPath + path, "utf-8");
            File file = new File(path);
            if (!file.exists() && !file.isDirectory()) {
                System.out.println("TxtUtils.getRequestPath " + path + "目录不存在，需要创建");
                //创建目录
                file.mkdir();
            }
        } catch (IOException e) {
            throw new RuntimeException("获取文件路径失败！");
        }
        return path;
    }

    public static void writerJson(String jsonPath, String content) {
        FileOutputStream fos = null;
        PrintWriter pw = null;
        try {
            File file = new File(jsonPath);
            //判断目标文件所在的目录是否存在
            if (!file.getParentFile().exists()) {
                //如果目标文件所在的目录不存在，则创建父目录
                logger.warn("------------------目标文件所在目录不存在，准备创建它！");
                if (!file.getParentFile().mkdirs()) {
                    throw new RuntimeException("创建目标文件所在目录失败！");
                }
            }
            fos = new FileOutputStream(file);
            pw = new PrintWriter(fos);
            pw.write(content.toCharArray());
            pw.flush();
        } catch (IOException e) {
            e.printStackTrace();
            throw new RuntimeException("文件生成失败！");
        } finally {
            try {
                if (fos != null)
                    fos.close();

                if (pw != null)
                    pw.close();

            } catch (IOException e) {
                throw new RuntimeException("文件生成失败！");
            }
        }
    }


    public static void writerJson(String fileName, Object object) {
        if (object != null) {
            String path = getRequestPath(JSON_PATH) + "/" + fileName;

            writerJson(path, JSON.toJSONString(object));
        }
    }

    public static void deleteJson(String fileName) {
        String path = getRequestPath(JSON_PATH) + "/" + fileName;
        File file = new File(path);
        if (file.exists()) {
            file.delete();
        }
    }
}
