package cuiportalapplication.users;
import java.io.Serializable;
import java.util.*;
public class Quiz implements Serializable{
    private String question;
    private String correctAnswer;
    private String [] options;
    private String subject;
    public Quiz (){ 
        question="";
    correctAnswer = "";
    options = new String[0];
    subject = "";
    }
    public Quiz (String question, String correctAnswer, String [] options, String subject){
        this.question = question;
        this.correctAnswer = correctAnswer;
        this.options = options;
        this.subject = subject;
    }
    public void setQuestion(String question){
        this.question = question;
    }
    public void setCorrectAnswer(String correctAnswer){
        this.correctAnswer = correctAnswer;
    }
    public void setOptions(String [] options){
        this.options = options;
    }
    public void setSubject(String subject){
        this.subject = subject;
    }
    public String getQuestion(){
        return question;
    }
    public String getCorrectAnswer(){
        return correctAnswer;
    }
    public String [] getOptions(){
        return options;
    }
    public String getSubject(){
        return subject;
    }
    @Override
    public String toString(){
        return "Question: "+question+"\nCorrect Answer: "+correctAnswer+"\nOptions: "+Arrays.toString(options)+"\nSubject: "+subject;
    }
}
