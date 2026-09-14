package cuiportalapplication.codes;
import cuiportalapplication.users.*;
import java.util.*;
import cuiportalapplication.codes.*;
public class QuizDemoQuestions {
    public static void main(String[] args) {
        // Create an ArrayList of Quiz type
        ArrayList<Quiz> quizzes = new ArrayList<>();

        // Add actual questions to the ArrayList
        quizzes.add(new Quiz(
            "What does OOP stand for?",
            "1",
            new String[]{"Object-Oriented Programming", "Output-Oriented Programming", "Object-Oriented Process", "Object-Oriented Procedures"},
            "OOP"
        ));

        quizzes.add(new Quiz(
            "Which of the following is not an OOP principle?",
            "3",
            new String[]{"Encapsulation", "Inheritance", "Compilation", "Polymorphism"},
            "OOP"
        ));

        quizzes.add(new Quiz(
            "What is the concept of wrapping data and methods in a single unit called?",
            "1",
            new String[]{"Encapsulation", "Abstraction", "Polymorphism", "Inheritance"},
            "OOP"
        ));

        quizzes.add(new Quiz(
            "Which feature allows a class to inherit the properties of another class?",
            "4",
            new String[]{"Encapsulation", "Polymorphism", "Abstraction", "Inheritance"},
            "OOP"
        ));

        quizzes.add(new Quiz(
            "What is method overriding in OOP?",
            "2",
            new String[]{"A method with the same name in the same class", "A method with the same name in a subclass", "A method with a different name in a subclass", "A method with the same name and return type in the same class"},
            "OOP"
        ));

        quizzes.add(new Quiz(
            "Which concept hides the implementation details and shows only the functionality?",
            "3",
            new String[]{"Encapsulation", "Inheritance", "Abstraction", "Polymorphism"},
            "OOP"
        ));

        quizzes.add(new Quiz(
            "Which of the following best defines polymorphism in OOP?",
            "4",
            new String[]{"A single method with multiple names", "Many classes with the same name", "Many methods with the same name but in different classes", "One name, many forms"},
            "OOP"
        ));

        quizzes.add(new Quiz(
            "Which keyword is used to create a subclass in Java?",
            "1",
            new String[]{"extends", "implements", "inherits", "super"},
            "OOP"
        ));

        quizzes.add(new Quiz(
            "Which access modifier restricts access to the class itself?",
            "2",
            new String[]{"Protected", "Private", "Public", "Default"},
            "OOP"
        ));

        quizzes.add(new Quiz(
            "Which of the following is true about constructors in Java?",
            "3",
            new String[]{"They have a return type", "They can be called explicitly", "They initialize an object", "They must have the same name as a method"},
            "OOP"
        ));

        // Print all quiz details
        for (Quiz quiz : quizzes) {
            System.out.println("Question: " + quiz.getQuestion());
            System.out.println("Options: ");
            for (int i = 0; i < quiz.getOptions().length; i++) {
                System.out.println((i + 1) + ". " + quiz.getOptions()[i]);
            }
            System.out.println("Correct Answer: Option " + quiz.getCorrectAnswer());
            System.out.println("Subject: " + quiz.getSubject());
            System.out.println();
        }
        FileHandling.writeCompleteFileAgainUpdated(Quiz.class, quizzes);
    }
}
