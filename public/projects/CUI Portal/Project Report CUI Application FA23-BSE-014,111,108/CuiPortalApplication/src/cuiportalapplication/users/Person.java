/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package cuiportalapplication.users;
import java.io.Serializable;
import java.util.ArrayList;

public class Person implements Serializable, PersonInterface{
    
    private static final long serialVersionUID = 1L;  // ID for Person class
    public static String [] personData=new String [9];
    
    private String name;
    private String fatherName;
    private String age;
    private String gender;
    private String cnic;
    private String contactNumber;
    private String address;
    private String id;
    private String password;
    
    
    public Person() {
        this.name = "";
        this.fatherName = "";
        this.age = "";
        this.gender = "";
        this.cnic = "";
        this.contactNumber = "";
        this.address = "";
        this.id = "";
        this.password = "";
    }
    
    public Person(String name, String fatherName, String age, String gender, String cnic, String contactNumber, String address, String id, String password) {
        this.name = name;
        this.fatherName = fatherName;
        this.age = age;
        this.gender = gender;
        this.cnic = cnic;
        this.contactNumber = contactNumber;
        this.address = address;
        this.id = id;
        this.password = password;
    }
    
    @Override
    public String toString() {
        return "Person{" +
                "name='" + name + '\'' +
                ", fatherName='" + fatherName + '\'' +
                ", age='" + age + '\'' +
                ", gender='" + gender + '\'' +
                ", cnic='" + cnic + '\'' +
                ", contactNumber='" + contactNumber + '\'' +
                ", address='" + address + '\'' +
                ", id='" + id + '\'' +
                ", password='" + password + '\'' +
                '}';
    }
    
    @Override
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
    @Override
    public String getFatherName() {
        return fatherName;
    }

    public void setFatherName(String fatherName) {
        this.fatherName = fatherName;
    }
    @Override
    public String getAge() {
        return age;
    }

    public void setAge(String age) {
        this.age = age;
    }
    @Override
    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }
    @Override
    public String getCnic() {
        return cnic;
    }

    public void setCnic(String cnic) {
        this.cnic = cnic;
    }
    @Override
    public String getContactNumber() {
        return contactNumber;
    }

    public void setContactNumber(String contactNumber) {
        this.contactNumber = contactNumber;
    }
    @Override
    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }
    @Override
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }
    @Override
    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
    
}

