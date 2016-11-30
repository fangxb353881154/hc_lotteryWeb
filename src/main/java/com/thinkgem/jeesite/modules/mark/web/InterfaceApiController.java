package com.thinkgem.jeesite.modules.mark.web;

import com.thinkgem.jeesite.modules.mark.entity.MarkSix;
import com.thinkgem.jeesite.modules.mark.service.MarkSixService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 * Created by Administrator on 2016/11/29.
 */
@Controller
@RequestMapping(value = "${adminPath}/api")
public class InterfaceApiController {

    @Autowired
    private MarkSixService markSixService;

    @RequestMapping(value = "/markSix/getLottery")
    @ResponseBody
    public MarkSix getLottery() {
        return markSixService.getMax();
    }
}
