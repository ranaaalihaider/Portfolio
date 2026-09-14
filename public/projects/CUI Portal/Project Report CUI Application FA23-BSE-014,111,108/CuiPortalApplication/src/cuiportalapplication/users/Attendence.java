package cuiportalapplication.users;
import java.io.Serializable;
import java.util.*;
public class Attendence implements Serializable{
    private Date date;
    private boolean isPresent;
    private String topic;
    Attendence(){
        date = new Date();
        isPresent = false;
    }
    Attendence(boolean state, String t){
        date = new Date();
        isPresent = state;
        topic=t;
        System.out.println(topic);
        System.out.println(isPresent);
    }
    public void setPresent(boolean status){
        date = new Date();
        isPresent =status;
    }
    public boolean getPresent(){
        return isPresent;
    }
    public Date getDate(){
        return date;
    }
    public String getStatus(){
        if(isPresent){
            return "Present";
        }else{
            return "Absent";
        }
    }
    public void setTopic(String t){
        topic=t;
    }
    public String getTopic(){
        return topic;
    }
}
