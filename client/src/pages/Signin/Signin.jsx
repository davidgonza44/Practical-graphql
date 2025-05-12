import {Button} from "react-bootstrap";
import { gql  , useMutation } from "@apollo/client"
import { useEffect, useState } from "react";
import { Form } from "react-bootstrap";

const SIGNIN = gql`
    mutation SignIn($email : String!, $password : String!){
        signin(credentials : { password : $password, email : $email}){
            userErrors{
                message
            }
            token
        }
    }
`

export const Signin = () => {
    const [signin, {data , loading}] = useMutation(SIGNIN)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [message, setMessage] = useState(null)

    useEffect(() => {
        if (data && data.signin.userErrors.length) setMessage(data.signin.userErrors[0].message)
        if (data && data.signin.token) {
            localStorage.setItem("prisma-token", data.signin.token)
            setMessage('SignIn successfully. Token Saved')
        }
    }, [data])

    const handleClick = () => {
        signin({
            variables : {
                email : email,
                password : password
            }
        })
    }

    return(
        <div>
            <Form>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label className="text-start w-100">Email address</Form.Label>
                    <Form.Control type="email" placeholder="Enter email" onChange={(e) => setEmail(e.target.value)}/>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label className="w-100 text-start">Password</Form.Label>
                    <Form.Control type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)}/>
                </Form.Group>
                {message && <p style={{backgroundColor : 'blue', color : 'white', padding : '5px'}}>
                        {message}
                    </p>}
                    <Button className="mt-3!" onClick={handleClick}>Signin</Button>
            </Form>
        </div>
    )

}
