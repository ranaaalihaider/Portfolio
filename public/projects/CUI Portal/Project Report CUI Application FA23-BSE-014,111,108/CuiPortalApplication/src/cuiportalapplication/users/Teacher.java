package cuiportalapplication.users;

import java.io.Serializable;
import java.util.ArrayList;

public class Teacher extends Person implements Serializable,TeacherInterface{
    private static final long serialVersionUID = 3L;  
    public static String [] newTeacherData=new String[3];
    private String qualification;
    private String experience;
    private String subjectToTeach;

    public Teacher() {
        super();
        this.qualification = "";
        this.experience = "";
        this.subjectToTeach = "";
    }
    public Teacher(String name, String fatherName, String age, String gender, String cnic, String contactNumber, String address, String id, String password, String qualification, String experience, String subjectToTeach) {
        super(name, fatherName, age, gender, cnic, contactNumber, address, id, password);
        this.qualification = qualification;
        this.experience = experience;
        this.subjectToTeach = subjectToTeach;
    }
    @Override
    public String getQualification() {
        return qualification;
    }

    public void setQualification(String qualification) {
        this.qualification = qualification;
    }
    @Override
    public String getExperience() {
        return experience;
    }

    public void setExperience(String experience) {
        this.experience = experience;
    }
    @Override
    public String getSubjectToTeach() {
        return subjectToTeach;
    }

    public void setSubjectToTeach(String subjectToTeach) {
        this.subjectToTeach = subjectToTeach;
    }
    
    
    
    public static Teacher chnageToObject(String person[], String [] teacher){
        Teacher temp=new Teacher(person[0],person[1],person[2],person[3],person[4],person[5],person[6],person[7],person[8],teacher[0],teacher[1],teacher[2]);
        return temp;
    }
}
