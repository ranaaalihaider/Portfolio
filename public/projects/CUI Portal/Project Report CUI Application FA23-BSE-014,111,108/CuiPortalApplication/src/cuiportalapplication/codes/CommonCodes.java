package cuiportalapplication.codes;
import cuiportalapplication.users.*;
import javax.swing.*;
import java.lang.reflect.Method;
import javax.swing.table.DefaultTableModel;
public class CommonCodes {
    private static String defaultTheme="FlatHiberbeeDarkIJTheme";
    public static Person globalPerosnObject;
    public static Student globalStudentObject;
    public static Teacher globalTeacherObject;
    
    public static void selectThemeOptionPane(){
        String[] themes = {
            "FlatArcIJTheme",
            "FlatArcOrangeIJTheme",
            "FlatArcDarkIJTheme",
            "FlatArcDarkOrangeIJTheme",
            "FlatCarbonIJTheme",
            "FlatCobalt2IJTheme",
            "FlatCyanLightIJTheme",
            "FlatDarkFlatIJTheme",
            "FlatDarkPurpleIJTheme",
            "FlatDraculaIJTheme",
            "FlatGradiantoDarkFuchsiaIJTheme",
            "FlatGradiantoDeepOceanIJTheme",
            "FlatGradiantoMidnightBlueIJTheme",
            "FlatGradiantoNatureGreenIJTheme",
            "FlatGrayIJTheme",
            "FlatGruvboxDarkHardIJTheme",
            "FlatGruvboxDarkMediumIJTheme",
            "FlatGruvboxDarkSoftIJTheme",
            "FlatHiberbeeDarkIJTheme",
            "FlatHighContrastIJTheme",
            "FlatLightFlatIJTheme",
            "FlatMaterialDesignDarkIJTheme",
            "FlatMonocaiIJTheme",
            "FlatMonokaiProIJTheme",
            "FlatNordIJTheme",
            "FlatOneDarkIJTheme",
            "FlatSolarizedDarkIJTheme",
            "FlatSolarizedLightIJTheme",
            "FlatSpacegrayIJTheme",
            "FlatVuesionIJTheme",
            "FlatXcodeDarkIJTheme"
        };

        // Show the options in a dialog and get the selected theme
        String selectedTheme = (String) JOptionPane.showInputDialog(
                null, // Parent component (null means no parent)
                "Select a Theme:", // Message
                "Theme Selection", // Title
                JOptionPane.PLAIN_MESSAGE, // Message type
                null, // Icon (null means default)
                themes, // The array of options
                themes[0] // Default selection
        );

        // Check if a theme was selected
        if (selectedTheme != null) {
            try {
                // Load the class based on the selected theme
                
                // Helping Source GPT  Created BY Ali Haider FA23-BSE-014
                Class<?> themeClass = Class.forName("com.formdev.flatlaf.intellijthemes." + selectedTheme);

                // Get the 'setup' method from the class
                Method setupMethod = themeClass.getMethod("setup");

                // Invoke the 'setup' method
                setupMethod.invoke(null); // Null because it's a static method

                // Show message indicating the theme is applied
                JOptionPane.showMessageDialog(null, "Theme " + selectedTheme + " applied successfully!");
            } catch (Exception e) {
                JOptionPane.showMessageDialog(null, "Error applying theme: " + e.getMessage());
            }
        } else {
            JOptionPane.showMessageDialog(null, "No theme selected.");
        }
    }
    
    public static void showSubjectsTable(String[] subjects) {
        // Column name
        String[] columnNames = {"Subject Name"};

        // Populate table data using the subjects array
        Object[][] data = new Object[subjects.length][1];
        for (int i = 0; i < subjects.length; i++) {
            data[i][0] = subjects[i]; // Each subject in a new row
        }

        // Create table model and table
        JTable table = new JTable(new DefaultTableModel(data, columnNames));
        table.setFillsViewportHeight(true);

        // Add table to a scroll pane with a smaller preferred size
        JScrollPane scrollPane = new JScrollPane(table);
        scrollPane.setPreferredSize(new java.awt.Dimension(200, 150)); // Set custom size

        // Show the table in an option pane
        JOptionPane.showMessageDialog(
            null, 
            scrollPane, 
            "Subjects", 
            JOptionPane.INFORMATION_MESSAGE
        );
    }
    public static String checkText(String s){
        
            if(s.matches("[a-zA-Z ]+"))
                return "true";
            else
                return "Please Enter Alphabets Only";
    }
    public static String checkNumeric(String s){
        if(s.matches("\\d+"))
            return "true";
        else
            return "Enter Numbers Only";
    }
    public static String checkCNIC(String s){
        
        if(s.matches("\\d{5}-\\d{7}-\\d{1}$"))
            return "true";
        else
            return "Enter CNIC No 00000-0000000-0";
    }
    public static String checkID(String s) {
        if (s.matches("[a-zA-Z]{2}\\d{2}-[A-Z]{3}-\\d{3}")) {
            return "true";
        } else {
            return "Enter Valid ID eg: FA24-BSE-001";
        }
    }
}
