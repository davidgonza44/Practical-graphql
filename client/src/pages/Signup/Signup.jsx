import { Form, Button} from "react-bootstrap";
import { gql, useMutation } from "@apollo/client";
import { useEffect, useState } from "react";

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

export const Signup = () => {
    const [signup, { data, loading, error }] = useMutation(SIGNUP)
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
                localStorage.setItem("prisma-token", data.signup.token)
                setMessage("Signed up successfully")
            }
        }
    }, [data])

    return (
        <div>
            <Form>
                <Form.Group className="mb-3">
                    <Form.Label className="text-start w-100">Name</Form.Label>
                    <Form.Control type="text" placeholder="Enter name" onChange={(e) => setName(e.target.value)}/>
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label className="text-start w-100">Email</Form.Label>
                    <Form.Control type="email" placeholder="Enter email" onChange={(e) => setEmail(e.target.value)}/>
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label className="text-start w-100">Password</Form.Label>
                    <Form.Control type="password" placeholder="Enter password" onChange={(e) => setPassword(e.target.value)} />
                </Form.Group>


                <Form.Group className="mb-3" controlId="exampleForm.ControlTextArea1">
                    <Form.Label className="text-start w-100">Bio</Form.Label>
                    <Form.Control as="textarea" rows={3} onChange={(e) => setBio(e.target.value)}/>
                </Form.Group>
                {error && <p>{error}</p>}
                {message && <p style={{ backgroundColor : 'blue', color : 'white', padding : '5px'}}> {message}</p>}
                <Button onClick={handleClick} variant="primary">Signup</Button>
            </Form>
        </div>
    )
}