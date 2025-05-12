import "./Post.css"
import { gql, useQuery, useMutation } from "@apollo/client"

const PUBLISH_POST = gql`
    mutation PublishPost($postId : ID!){
        postPublish(postId : $postId){
            post{
                title
            }
        userErrors{
            message
        }
        }
    }
`

const UNPUBLISH_POST = gql`
    mutation UnpublishPost($postId : ID!){
        postUnpublish(postId : $postId){
            userErrors{
                message
            }
            post{
                title
            }
        }
    }
`

const Post = ({ title, content, date, user, published, id, isMyProfile}) => {
    const formatedDate = new Date(Number(date))
    const [publishPost, { data, loading }] = useMutation(PUBLISH_POST)
    const [unPublishPost, { data : unData, loading : unLoading }] = useMutation(UNPUBLISH_POST)

    return(
        <div className="post" style={published === false ? {backgroundColor : "yellow"} : {}}>
            <div className="post-btns mb-3">
            {isMyProfile && published == false && <button onClick={() => publishPost({ variables : {postId : id}})} className="post__btn">Publish</button>}
            {isMyProfile && published && <button onClick={() => unPublishPost({variables : {postId : id}})} className="post__btn">Unpublish</button>}
            </div>
            <div className="post__header">
                <h3 className="me-3">{title}</h3>
                <h4>Created At {`${formatedDate}`.split(" ").slice(0,3).join(" ")} by
                    {" "}{user}
                </h4>
            </div>
            <div className="post-btns">
                <p className="post__content ">{content}</p>
            </div>
        </div>
    )
}

export default Post