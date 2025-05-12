import { Form } from "react-bootstrap";
import { gql, useMutation } from "@apollo/client";
import { useState } from "react";

const SIGNUP = gql`
    mutation SignUp($email: String!, $password: String!, $name:
    String!, $bio: String!){
    signup(credentials: { password: $password, email: $email},
        name: $name, bio: $bio) {
        userErrors { message }
            token
        }
    }
`

const Signup = () => {
    const [signup, { data, loading }] = useMutation(SIGNUP)
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [bio, setBio] = useState("");
    const [message, setMessage] = useState(null)
    const handleClick = () => signup({ variables : { email , password, name, bio}})
    useEffect(() => {
        if (data) {
            if (data.signup.userErrors.length > 0) {
                setMessage(data.signup.userErrors[0].message)
            } else {
                setMessage("Signed up successfully")
            }
        }
    }, [data])
}