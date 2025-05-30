import { useParams } from "react-router"
import Post from "../../components/Post"
import { gql, useQuery} from "@apollo/client"
import { AddPostModal } from "../../components/AddPostModal"

const GET_PROFILE = gql`
    query GetProfile($userId : ID!){
        profile(userId : $userId){
            id
            bio
            isMyProfile
            user{
                id
                name
                email
                posts{
                    id
                    title
                    published
                    content
                    createdAt
                }
            }
        }
    }
`

export const Profile = () => {
    const { id } = useParams()
    const { loading, error, data } = useQuery(GET_PROFILE, {
        variables: { userId : id},
        fetchPolicy : "network-only"
    })
    if (error) return <h1>Error</h1>
    if (loading) return <h1>Loading...</h1>
    const {profile } = data
    console.log("Is my profile:", profile.isMyProfile)
    console.log("Token exists:", !!localStorage.getItem("prisma-token"))
    return (
        <div>

            <div style={{ marginBottom: "2rem", display: "flex ",
            justifyContent: "space-between" }}>
                <div>
                    <h1>{profile.user.name}</h1>
                    <p>{profile.bio}</p>
                </div>
                    <div>
                        {profile.isMyProfile ? <AddPostModal /> : null}
                    </div>
                </div>

                <div>
                    {profile.user.posts.map(post =>
                        <Post key={post.id} title={post.title} content={post.content} date={post.createdAt} id={post.id} user={profile.user.name} published={post.published} isMyProfile={profile.isMyProfile} />
                    )}
                </div>
        </div>

    )
}