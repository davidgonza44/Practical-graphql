import { Modal, Button, Form } from "react-bootstrap";
import { useEffect, useState } from "react";
import { gql, useMutation } from "@apollo/client";

const CREATE_POST = gql`
    mutation PostCreate($title : String!,  $content : String!){
        postCreate(input : { content : $content, title: $title,  }){
            userErrors {
                message
            }
            post {
                id
                title
                content
                createdAt
                user{
                    name
                }
            }
        }
    }
`

export const AddPostModal = () =>{
    const [createPost, { data, loading, error }] = useMutation(CREATE_POST);
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [ content, setContent] = useState('');
    const [ title, setTitle] = useState('');
    const [message , setMessage] = useState('');

    const handleClick = () => {
        createPost({ variables : { title, content }});
        handleClose()
    }

    useEffect(() => {
        if (data && data.postCreate.userErrors.length){
            setMessage(data.postCreate.userErrors[0].message);
        }
    }, [data])



    if (loading) return <h1>Loading...</h1>;
    if (error) return <h1>Error</h1>;

    return (
    <>
        <div style={{ marginLeft: "4rem", marginBottom: "2rem" }}>
            <Button variant="primary" style={{marginTop : "2rem"}} onClick={handleShow}>
                Add Post
            </Button>

            <Modal show={show} onHide={handleClose} backdrop="static">
                <Modal.Header closeButton>
                    <Modal.Title>Add Post</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {message && <p style={{backgroundColor : 'blue', color : 'white', padding : '5px'}}>
                            {message}
                        </p>
                    }
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Title</Form.Label>
                            <Form.Control type="text" placeholder="Enter title" onChange={(e) => setTitle(e.target.value)} />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Content</Form.Label>
                            <Form.Control as="textarea" rows={3} onChange={(e) => setContent(e.target.value)} />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={handleClose}>Close</Button>
                    <Button onClick={handleClick}>Save Changes</Button>
                </Modal.Footer>
            </Modal>
        </div>
    </>
    )
}