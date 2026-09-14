import cuiportalapplication.codes.FileHandling;
import cuiportalapplication.users.Student;
import java.util.ArrayList;

public class PrintStudents {
    public static void main(String[] args) {
        ArrayList<Student> students = FileHandling.readCompleteFile(Student.class);
        for (Student s : students) {
            System.out.println("ID: " + s.getId());
            System.out.println("Password: " + s.getPassword());
            System.out.println("Name: " + s.getName());
        }
    }
}
