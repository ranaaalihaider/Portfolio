/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package cuiportalapplication.users;
import java.util.ArrayList;
/**
 *
 * @author RANAA
 */
public interface StudentInterface {
    void markAttendence(boolean isPresent, String topic);
    double getAttendencePercentage();
    boolean setQuizMarks(Marks todayMarks);
    ArrayList<Marks> getAllQuizMarks();
    ArrayList<Marks> getMarksOfSubject(String subject);
    ArrayList<Attendence> getAttendenceOfAllDays();
}
