package com.klu.springmvc;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.klu.springmvc.model.Task;
import com.klu.springmvc.service.TaskService;

@RestController
@RequestMapping("/ms2")
public class MS2Controller {

    @Autowired
    TaskService taskService;

    @GetMapping("/mul")
    public String add(@RequestParam("a") int a, @RequestParam("b") int b) {
        int result = a * b;
        return "MS 2.1 - Multiplication = " + result;
    }

    @PostMapping("/createtask")
    public Object createTask(@RequestBody Task task, @RequestHeader("Token") String token) {
        System.out.println("Task Controller MS2.1 createTask: " + task);
        return taskService.createTask(task, token);
    }

    @GetMapping("/getalltasks/{PAGE}/{SIZE}")
    public Object getAllTasks(@PathVariable("PAGE") int page, @PathVariable("SIZE") int size,
            @RequestHeader("Token") String token) {
        return taskService.getAllTasks(page, size, token);
    }

    @DeleteMapping("/deletetask/{ID}")
    public Object deleteTask(@PathVariable("ID") int id, @RequestHeader("Token") String token) {
        return taskService.deleteTask(id, token);
    }

    @GetMapping("/gettask/{ID}")
    public Object getTask(@PathVariable("ID") int id, @RequestHeader("Token") String token) {
        return taskService.getTask(id, token);
    }

    @PutMapping("/updatetask/{ID}")
    public Object updateTask(@PathVariable("ID") int id, @RequestBody Task task,
            @RequestHeader("Token") String token) {
        return taskService.updateTask(id, task, token);
    }

}
