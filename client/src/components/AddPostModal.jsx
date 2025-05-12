import { Modal, Button, Form } from "react-bootstrap";
import { useState } from "react";

export const AddPostModal = () =>{
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [ content, setContent] = useState('');
    const [ title, setTitle] = useState('');

    return (
    <>
        <div style={{ marginLeft: "4rem", marginBottom: "2rem" }}>
            <Button variant="primary" style={{marginTop : "2rem"}}>
                Add Post
            </Button>
        </div>
    </>
    )
}