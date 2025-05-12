import { gql, useQuery } from "@apollo/client";
import  Post  from "../../components/Post";

const GET_POSTS = gql`
    query{
        posts{
            id
            title
            content
            createdAt
            user{
                name
            }
        }
    }
`

export const Posts = () => {
    const { loading , data, error } = useQuery(GET_POSTS);
    if (error) return <h1>Error</h1>
    if (loading) return <h1>Loading</h1>
    const { posts} = data
    return(
        <>
            {posts.map(post => (
                <Post key={post.id} id={post.id} title={post.title} content={post.content} date={post.createdAt} user={post.user.name}/>
            ))}
        </>
    )
}