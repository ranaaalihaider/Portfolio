package cuiportalapplication.users;

import java.io.Serializable;

public class Marks implements Serializable{
    private int obtainedMarks;
    private String subject;
    public Marks(){
        obtainedMarks=0;
        subject="";
    }
    public Marks(int marks, String sub){
        obtainedMarks=marks;
        subject=sub;
    }
    public int getMarks(){
        return obtainedMarks;
    }
    public String getSubject(){
        return subject;
    }
    
}
