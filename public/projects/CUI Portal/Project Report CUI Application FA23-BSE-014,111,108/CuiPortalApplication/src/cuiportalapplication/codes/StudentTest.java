package cuiportalapplication.codes;
import cuiportalapplication.users.*;
import java.util.*;
public class StudentTest {
    public static void main(String[] args) {
        String[] names = {"Ali Ahmed", "Fatima Noor", "Usman Khan", "Ayesha Bano", "Hassan Raza", "Sara Malik", 
                      "Bilal Aslam", "Zainab Tariq", "Hamza Anwar", "Nimra Yousaf", "Ahmed Riaz", "Mahnoor Saeed",
                      "Tariq Jameel", "Sana Nisar", "Farhan Ali", "Hiba Qamar", "Saad Javed", "Iqra Shah",
                      "Shahid Nazir", "Komal Abbas"};
    String[] fatherNames = {"Ahmed Ali", "Noor Hussain", "Khan Nawaz", "Bano Rafiq", "Raza Hussain", 
                            "Malik Tariq", "Aslam Qureshi", "Tariq Butt", "Anwar Aziz", "Yousaf Ali", 
                            "Riaz Ahmed", "Saeed Nawaz", "Jameel Haq", "Nisar Baig", "Ali Bukhari", 
                            "Qamar Zia", "Javed Asghar", "Shah Mahmood", "Nazir Ahmed", "Abbas Ali"};
    String[] genders = {"Male", "Female"};
    String[] programs = {"BSE", "BCS", "BAI", "BDS"};
    String[] subjects = {"Mathematics", "Programming", "Physics", "Data Structures", "Database Systems", 
                         "Web Development", "AI", "Cyber Security"};
    Random random = new Random();

    for (int i = 0; i < 20; i++) {
        String name = names[i % names.length];
        String fatherName = fatherNames[i % fatherNames.length];
        String age = String.valueOf(18 + random.nextInt(6)); // Age between 18 and 24
        String gender = genders[random.nextInt(genders.length)];
        String cnic = String.format("%05d-%07d-%d", random.nextInt(99999), random.nextInt(9999999), random.nextInt(9));
        String contactNumber = "03" + (random.nextInt(10)) + String.format("%08d", random.nextInt(99999999));
        String address = "House No. " + random.nextInt(1000) + ", Street " + random.nextInt(50) + ", Lahore";
        
        // Select a program and ensure it matches the registration number
        String program = programs[random.nextInt(programs.length)];
        String id = String.format("FA%02d-%s-%03d", 23 + random.nextInt(3), program, i + 1); // Reg No matches program

        String password = "1122"; // Same password for all students
        String semester = String.valueOf(1 + random.nextInt(8)); // Semester between 1 and 8
        String fscMarks = String.valueOf(700 + random.nextInt(300)); // Marks between 700 and 1000
        String[] studentSubjects = Arrays.copyOfRange(subjects, 0, 4); // Select first 4 subjects

        // Create a new Student object
        Student student = new Student(name, fatherName, age, gender, cnic, contactNumber, address, id, password, semester, fscMarks, program, studentSubjects);
            FileHandling.writeObject(student);
        }

        System.out.println("Student data has been written to the file.");
    }
}
