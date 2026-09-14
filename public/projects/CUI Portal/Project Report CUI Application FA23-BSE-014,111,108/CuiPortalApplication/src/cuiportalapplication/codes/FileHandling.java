package cuiportalapplication.codes;
import java.io.*;
import java.util.*;
import  cuiportalapplication.users.*;
import java.io.*;
import java.util.ArrayList;
public class FileHandling {
    
    private static String path;

private static <T> void setPath(Class<T> clazz) {
   String basePath = "src/cuiportalapplication/files/";

    if (clazz == Student.class) {
        path = basePath + "Student.dat";
    } else if (clazz == Teacher.class) {
        path = basePath + "Teacher.dat";
    }else if (clazz == Quiz.class) {
        path = basePath + "Quiz.dat";}
    else {
        path = basePath + "error.dat";
    }
}

    public static <T> String  writeObject(T obj) {
        try {
            // Check if file exists
            setPath(obj.getClass());
            boolean fileExists = new File(path).exists();
            
            // Use FileOutputStream in append mode (true parameter)
            FileOutputStream fos = new FileOutputStream(path, true);
            ObjectOutputStream oos;
            
            if (fileExists) {
                // Use a custom ObjectOutputStream that doesn't write header
                oos = new AppendableObjectOutputStream(fos);
            } else {
                // For new file, use regular ObjectOutputStream
                oos = new ObjectOutputStream(fos);
            }
            
            // Write the object
            oos.writeObject(obj);
            oos.close();
            
            System.out.println("Object successfully written to file!");
            return "true";
            
        } catch (IOException e) {
            System.err.println("Error while writing object: " + e.getMessage());
            return e.getMessage();
        }
    }
    public static <T> String writeCompleteFileAgainUpdated(Class<T> clazz,ArrayList<T> newData){
        
        
        try {
            // Check if file exists
            setPath(clazz);
            
            FileOutputStream fos = new FileOutputStream(path);
            ObjectOutputStream oos = new ObjectOutputStream(fos);
            
            for( T obj: newData){
                oos.writeObject(obj);
            }
            
            // Write the object
            
            oos.close();
            
            System.out.println("Object successfully written to file!");
            return "true";
            
        } catch (IOException e) {
            System.err.println("Error while writing object: " + e.getMessage());
            return e.getMessage();
        }
    }
    public void printAllObjects() {
        try {
            FileInputStream fis = new FileInputStream(path);
            ObjectInputStream ois = new ObjectInputStream(fis);
            
            System.out.println("\nAll objects in file:");
            System.out.println("--------------------");
            
            int count = 0;
            while (true) {
                try {
                    Object obj = ois.readObject();
                    count++;
                    Student temp= (Student) obj;

                    System.out.println("Object " + count + ": " + temp);
                } catch (EOFException e) {
                    break;
                }
            }

            if (count == 0) {
                System.out.println("No objects found in file.");
            }
            ois.close();
            fis.close();
        } catch (FileNotFoundException e) {
            System.out.println("No file found. No objects have been saved yet.");
        } catch (IOException | ClassNotFoundException e) {
            System.err.println("Error while reading objects: " + e.getMessage());
        }
    }
    public static <T> ArrayList<T> readCompleteFile(Class <T> clazz){
        ArrayList<T> dataComplete = new ArrayList<>();
        try {
            setPath(clazz);
            FileInputStream fis = new FileInputStream(path);
            ObjectInputStream ois = new ObjectInputStream(fis);
            while (true) {
                try {
                    Object temp = ois.readObject();
                    dataComplete.add((T) temp);
                } catch (EOFException e) {
                    break;
                }
            }
            ois.close();
            fis.close();

        } catch (FileNotFoundException e) {
            System.out.println("No file found. No objects have been saved yet.");
        } catch (IOException | ClassNotFoundException e) {
            System.err.println("Error while reading objects: " + e.getMessage());
        }
        finally{
            System.out.println(dataComplete.isEmpty()+" FH Check");
            return dataComplete;
        }
    }
    public static <T> T findUsersObjectById(Class <T> clazz,String id){
        ArrayList<T> CompleteData=FileHandling.readCompleteFile(clazz);
        for(T temp:CompleteData){
            Person p=(Person)temp;
            if(p.getId().equals(id)){
                return (T)p;
            }
        }
        return null;
    }
    
    private static  class AppendableObjectOutputStream extends ObjectOutputStream {
        public AppendableObjectOutputStream(OutputStream out) throws IOException {
            super(out);
        }

        @Override
        protected void writeStreamHeader() throws IOException {
            // Don't write a header
        }
    }
    public static <T> boolean deleteObjectById(Class<T> clazz, String id){
        ArrayList<T> allData=new ArrayList<>();
        allData=readCompleteFile(clazz);
        ArrayList<T> dataToSave =new ArrayList<>();
        boolean found=false;
  
        for(T temp:allData){
            
            Person p2=(Person) temp;
            if(id.equalsIgnoreCase(p2.getId())){
                found=true;
            }
            else{
                dataToSave.add(temp);
            }
        }
        if(found){
            String status=writeCompleteFileAgainUpdated(clazz,dataToSave);
            if(status.equalsIgnoreCase("true")){
                return true;
            }
            else{
                return false;
            }
        }else{
            return found;
        }
       
    }
    public static ArrayList<Quiz> getQuizQuestionBySubject(String subject){
        ArrayList<Quiz> allQuestions=readCompleteFile(Quiz.class);
        
        ArrayList<Quiz> questionToReturn=new ArrayList<>();
        for(Quiz ques:allQuestions){
            try{
                if(questionToReturn.size()==10){
                    break;
                }
                Quiz temp=(Quiz) ques;
                if(temp.getSubject().equalsIgnoreCase(subject)){
                    questionToReturn.add(temp);
                }
            }catch(Exception e){
                return null;
            }
        }
        if(questionToReturn.size()==10){
            return questionToReturn;
        }else{
            return null;
        }
    }
    public static boolean updateObject(Student obj){
        ArrayList<Student> allStudents=readCompleteFile(Student.class);
        ArrayList<Student> dataToSave=new ArrayList<>();
        boolean found=false;
        for(Student s:allStudents){
            if(s.getId().equals(obj.getId())){
                dataToSave.add(obj);
                found=true;
            }else{
                dataToSave.add(s);
            }
        }
        if(found){
            String result=writeCompleteFileAgainUpdated(Student.class,dataToSave);
            if(result.equalsIgnoreCase("true")){
                return true;
            }
       
           
        }
         return false;
    }
}

