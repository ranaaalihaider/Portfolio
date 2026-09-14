/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Main.java to edit this template
 */
package cuiportalapplication;
import com.formdev.flatlaf.FlatDarculaLaf;
import com.formdev.flatlaf.FlatDarkLaf;
import com.formdev.flatlaf.FlatIntelliJLaf;
import com.formdev.flatlaf.FlatLightLaf;
import com.formdev.flatlaf.IntelliJTheme;
import com.formdev.flatlaf.intellijthemes.FlatHiberbeeDarkIJTheme;
import javax.swing.*;
//import de.javasoft.synthetica.standard.SyntheticaStandardLookAndFeel;
import cuiportalapplication.Screens.*;
/**
 *
 * @author RANAA
 */
public class CuiPortalApplication {

    /**
     * @param args the command line arguments
     */
    public static void main(String[] args) {
        try {
            //FlatDarkLaf.setup();
            //FlatDarculaLaf.setup();
            FlatHiberbeeDarkIJTheme.setup();
            
            //IntelliJTheme.setup()
            // Using the correct LookAndFeel class
           // UIManager.setLookAndFeel(new SyntheticaStandardLookAndFeel());
            System.out.println("Look and Feel applied successfully.");
        } catch (Exception e) {
            System.out.println("Failed to apply look and feel:");
            e.printStackTrace();  // Print the stack trace for debugging
        }

        // Continue with your application logic
        SplashScreen frame = new SplashScreen();
        frame.setVisible(true);
    }
    public static void changeTheme(){
        FlatIntelliJLaf.setup();
         
    }
    
}
