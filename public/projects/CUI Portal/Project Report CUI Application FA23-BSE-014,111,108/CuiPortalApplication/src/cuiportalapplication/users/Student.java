/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package cuiportalapplication.users;
import java.util.*;
import java.io.Serializable;

public class Student extends Person implements Serializable,StudentInterface {
    private static final long serialVersionUID = 2L;  // ID for Person class
    public static String [] newStudentData=new String[3];
    public static String [] selectedSubject;
    private String semester;
    private String fscMarks;
    private String program;
    private ArrayList<Marks> marksDetails;
    private String [] subjects;
    public ArrayList<Attendence> attendenceDeatils;
    protected double attendencePercentage;

    // Default constructor
    public Student() {
        super();
        this.semester = "";
        this.fscMarks = "";
        this.program = "";
        attendenceDeatils=new ArrayList<>();
        attendencePercentage=0;
        marksDetails=new ArrayList<>();
    }

    // Parameterized constructor
    public Student(String name, String fatherName, String age, String gender, String cnic, String contactNumber, String address, String id, String password, String semester, String fscMarks, String program, String [] subjects) {
        super(name, fatherName, age, gender, cnic, contactNumber, address, id, password);
        this.semester = semester;
        this.fscMarks = fscMarks;
        this.program = program;
        attendenceDeatils=new ArrayList<>();
        attendencePercentage=0;
        marksDetails=new ArrayList<>();
        this.subjects=subjects;
    }

    public Student(Student s) {
        super(s.getName(), s.getFatherName(), s.getAge(), s.getGender(), s.getCnic(), s.getContactNumber(), s.getAddress(), s.getId(), s.getPassword());
        this.semester = s.getSemester();
        this.fscMarks = s.getFscMarks();
        this.program = s.getProgram();
        this.attendenceDeatils=s.attendenceDeatils;
        this.attendencePercentage=s.attendencePercentage;
        this.marksDetails=s.marksDetails;
        this.subjects=s.subjects;
        
    }
    public String getSemester( ) {
        return this.semester;
    }
    public String getFscMarks( ) {
        return this.fscMarks;
    }
    public String getProgram( ) {
        return this.program;
    }
    
    @Override
    public String toString() {
    return "Student{" +
            "semester='" + semester + '\'' +
            ", fscMarks='" + fscMarks + '\'' +
            ", program='" + program + '\'' +
            ", " + super.toString() + 
            ", Subjects  " +String.join(" - ", subjects)+
            '}';
    }
    @Override
    public void markAttendence(boolean isPresent, String topic){
        Attendence today=new Attendence(isPresent,topic);
        System.out.println("Day added with in Student Clas "+isPresent);
        attendenceDeatils.add(today);
        System.out.println(today.getStatus()+ "Status of new object");
        updatePercentage();
    }
    private void updatePercentage(){
        int total=attendenceDeatils.size();
        int present=0;
        if(attendenceDeatils.size() !=0){
            for(Attendence oneDay:attendenceDeatils){
                if(oneDay.getPresent()){
                present++;
                }
            }
            attendencePercentage=((double)present/total)*100;
        }
        
        
    }
    @Override
    public double getAttendencePercentage(){
        return attendencePercentage;
    }
    
    public static Student chnageToObject(String person[], String [] student, String [] subjectsIn){
        Student temp=new Student(person[0],person[1],person[2],person[3],person[4],person[5],person[6],person[7],person[8],student[0],student[1],student[2],subjectsIn);
        return temp;
    }
    public String [] getSubjects(){
        return subjects;
    }
    @Override
    public boolean setQuizMarks(Marks todayMarks){
        return marksDetails.add(todayMarks);
    }
    @Override
    public ArrayList<Marks> getAllQuizMarks(){
        return marksDetails;
    }
    @Override
    public ArrayList<Marks> getMarksOfSubject(String subject){
        ArrayList<Marks> toReturn=new ArrayList<>();
        
        for(Marks oneQuiz:marksDetails){
            if(subject.equalsIgnoreCase(oneQuiz.getSubject())){
                toReturn.add(oneQuiz);
            }
        }
        return toReturn;
    }
    @Override
    public ArrayList<Attendence> getAttendenceOfAllDays(){
        return attendenceDeatils;
    }
    
}
