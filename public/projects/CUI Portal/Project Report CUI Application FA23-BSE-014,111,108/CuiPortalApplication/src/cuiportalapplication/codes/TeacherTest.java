package cuiportalapplication.codes;
import cuiportalapplication.users.*;
import java.io.*;

public class TeacherTest {
    public static void main(String[] args) {
        // Array to store 20 teacher objects
        Teacher[] teachers = new Teacher[5];

        // Create and initialize 20 teacher objects with Pakistani names and details
        for (int i = 0; i < 5; i++) {
           

        teachers[0] = new Teacher("Muzaffar Iqbal", "Muhammad Iqbal", "35", "Male", "12345-1234567-1", "03012345678", "Lahore, Pakistan", "TA23-CUI-100", "1122", "PhD", "5", "OOP");
        teachers[1] = new Teacher("Sara Bibi", "Shahida Bibi", "30", "Female", "12345-1234567-2", "03098765432", "Islamabad, Pakistan", "TA23-CUI-101", "1122", "M.Phil", "3", "OOP");
        teachers[2] = new Teacher("Ahmed Ali", "Faisal Ali", "40", "Male", "12345-1234567-3", "03211223344", "Karachi, Pakistan", "TA23-CUI-102", "1122", "PhD", "8", "DSA");
        teachers[3] = new Teacher("Zainab Raza", "Raza Raza", "28", "Female", "12345-1234567-4", "03123456789", "Rawalpindi, Pakistan", "TA23-CUI-103", "1122", "MS", "4", "ICT");
        teachers[4] = new Teacher("Jamil Akhtar", "Zahid Akhtar", "45", "Male", "12345-1234567-5", "03334445566", "Faisalabad, Pakistan", "TA23-CUI-104", "1122", "PhD", "10", "SEC");

            
            // Write each teacher object to file
            FileHandling.writeObject(teachers[i]);
        }

        System.out.println("Teacher data has been written to the file.");
    }
}
