import { useEffect, useState, useRef } from "react";
import DigiMenu from "./DigiMenu";
import { useParams } from "react-router-dom";
import supabase from "../../services/supabase";
import "../../scss/ConfirmTable.scss";
import { getMenuOtp } from "../../services/supported_api";

export default function ConfirmTable() {
    const [enteredKey, setEnteredKey] = useState(Array(5).fill(""));
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const { loc_id, table_id } = useParams();
    const [passKey, setPassKey] = useState("");
    const [hasInserted, setHasInserted] = useState(false); // Track insertion
    const inputRefs = useRef([]); // Refs to handle focus on each input

    useEffect(() => {
        const fetchLocation = async () => {
            try {
                const requiresPasskey = await getMenuOtp(loc_id); // Call the imported function
                console.log("Requires passkey:", requiresPasskey); // Log the result

                // If the passkey is not required, authenticate automatically
                if (!requiresPasskey) {
                    setIsAuthenticated(true);
                }
            } catch (error) {
                console.error("Error fetching location:", error); // Log errors
            }
        };

        fetchLocation(); // Call the function inside useEffect
    }, [loc_id]);

    useEffect(() => {
        if (isAuthenticated) return; // Skip passkey generation if authenticated

        if (hasInserted) return; // Prevent duplicate insertion

        // Generate a random 5-digit passkey
        const generatePassKey = () => {
            return Math.floor(10000 + Math.random() * 90000).toString();
        };

        // Insert passkey, loc_id, and table_id into Supabase table
        const insertPassKey = async () => {
            const newPassKey = generatePassKey();
            setPassKey(newPassKey);

            const { data, error } = await supabase
                .from("OTP_TABLE")
                .insert([
                    {
                        loc_id: loc_id,
                        table_id: table_id,
                        passKey: newPassKey,
                        waiter_consumed: false,
                    },
                ])
                .select();

            if (error) {
                console.error("Error inserting passKey:", error.message);
            } else {
                console.log("PassKey inserted successfully:", data, data[0]?.passKey);
                setHasInserted(true); // Mark as inserted
            }
        };

        // Run insert function on component mount
        insertPassKey();

        inputRefs.current[0]?.focus();
    }, [loc_id, table_id, hasInserted, isAuthenticated]);

    const handleAuthenticate = () => {
        const userEnteredKey = enteredKey.join("");
        if (userEnteredKey === passKey) {
            setIsAuthenticated(true);
            localStorage.setItem("iscustomerauthenticated", "true"); // Save to local storage
        } else {
            alert("Incorrect Key! Please try again.");
        }
    };

    const handleChange = (e, index) => {
        const newEnteredKey = [...enteredKey];
        newEnteredKey[index] = e.target.value;
        setEnteredKey(newEnteredKey);

        // Move to the next input if a digit was entered and it's not the last box
        if (e.target.value && index < 4) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace" && index > 0 && !enteredKey[index]) {
            inputRefs.current[index - 1]?.focus();
        } else if (e.key === "Enter" && index === 4) {
            handleAuthenticate();
        }
    };

    if (isAuthenticated) {
        return <DigiMenu />;
    }

    return (
        <div className="flexbox flex-col items-center justify-center h-screen confirm-table">
            <h1 className="text-xl font-bold mb-4 confirm-table--header">
                Please enter the 5-digit key
            </h1>
            <div className="flexbox space-x-3">
                {enteredKey.map((digit, index) => (
                    <input
                        key={index}
                        type="text"
                        maxLength="1"
                        className="w-12 h-12 text-center border rounded-lg text-2xl confirm-table--input"
                        value={digit}
                        onChange={(e) => handleChange(e, index)}
                        onKeyDown={(e) => handleKeyDown(e, index)}
                        ref={(el) => (inputRefs.current[index] = el)}
                    />
                ))}
            </div>
            <button
                className="neu-button neu-button--submit my-8 thick-shadow"
                onClick={handleAuthenticate}
                type="submit"
            >
                Proceed
            </button>
        </div>
    );
}