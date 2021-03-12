import axios from "axios"
import { useState, useRef, useEffect, createRefs } from "react"
import { useHistory, useParams } from "react-router-dom"
import moment from "moment"
import { useStatusUrl } from "../contexts/statusUrl"
import { useUser } from "../contexts/user"
import "./styles/CommentFeed.scss"

const CommentFeed = ({ id }) => {

    const { serverUrl } = useStatusUrl()
    const { user } = useUser()
    // const { id } = useParams()
    const [comments, setComments] = useState([])
    const [replies, setReplies] = useState([])
    const [mainText, setMainText] = useState("")
    const [repliedCommentId, setRepliedCommentId] = useState(null)
    const [isLoading, setLoading] = useState(true)
    // const [replyInputRefs, setReplyInputRefs] = useState([])

    const getComments = () => {
        axios
            .get(`${serverUrl}/api/get-comments/${id}`)
            .then(res => {
                setComments([...res.data])
                setLoading(false)
            })
            .catch(err => console.log(err))
    }

    const getReplies = () => {
        axios
            .get(`${serverUrl}/api/get-replies/${id}`)
            .then(res =>
                setReplies([...res.data])
            )
            .catch(err => console.log(err))
    }


    useEffect(() => {
        getComments()
        getReplies()
    }, [])

    const showReplyInput = (commentId) => {
        let replyDiv = document.getElementById(`${commentId}`)
        let allReplyDivs = document.querySelectorAll(".replyFormParent")
        for (let i = 0; i < allReplyDivs.length; i++) {
            console.log(allReplyDivs[i])
            allReplyDivs[i].style.display = "none"
        }
        replyDiv.style.display = "flex"
        setRepliedCommentId(commentId)
    }


    const addComment = (e) => {
        e.preventDefault()

        let date = moment().format('MMMM Do YYYY')
        let time = moment().format('LT')

        axios
            .post(`${serverUrl}/api/post-comment`, {
                threadId: id,
                userId: user.id,
                repliedCommentId,
                username: user.username,
                mainText,
                dateCreated: date,
                timeCreated: time
            })
            .then(res => console.log(res))
            .catch(err => console.log(err))
    }


    if (isLoading) {
        return <div className="App">
            <h1>Loading...</h1>
        </div>
    }

    return (
        <div className="commentsContainer">
            {
                user &&
                <form className="commentForm" onSubmit={(e) => addComment(e)}>
                    <div className="commentInputParent">
                        <input placeholder="Leave a comment" onChange={(e) => setMainText(e.target.value)} />

                    </div>

                    <button>Submit</button>
                </form>
            }
            {
                comments && comments.map((comment, i) =>
                    <div key={i} className="commentContainer">
                        <div className="textAndInfoParent">
                            <div className="profilePicUsernameParent">
                                <div className="profilePicParent">
                                    <img src="../../placeholderPerson.png" alt={`${comment.username}'s profile picture`} />
                                </div>
                                <p className="username">{comment.username}</p>
                            </div>
                            <p className="mainText">{comment.main_text}</p>
                            {/* <div className="commentInfo">
                                <div className="dateTime">
                                    <p className="date">{comment.date_created}</p>
                                    &nbsp; &nbsp;
                                    <p className="time">{comment.time_created}</p>
                                </div>
                            </div> */}
                            {user &&
                                <>
                                    <div className="replyButtonDiv">
                                        <button onClick={() => showReplyInput(comment.id)}>Reply</button>
                                    </div>  
                                    <div id={comment.id} className="replyFormParent">
                                        <form className="replyForm" onSubmit={(e) => addComment(e)}>
                                            <input placeholder={`Reply to ${comment.username}`} name="mainTextInput" onChange={e => setMainText(e.target.value)} />
                                        </form>
                                    </div>
                                </>
                            }
                        </div>


                        <div className="repliesFeed">
                            {replies.map(rep => rep.replied_comment_id === comment.id && (
                                <div className="replyContainer">
                                    <div className="profilePicUsernameParent">
                                        <div className="profilePicParent">
                                            <img src="../../placeholderPerson.png" alt={`${comment.username}'s profile picture`} />
                                        </div>
                                        <p className="username">{comment.username}</p>
                                    </div>
                                    <p className="mainText">{rep.main_text}</p>
                                    <div className="replyInfo">

                                        {/* <div className="dateTime">
                                            <p className="time">{rep.time_created}</p>
                                            &nbsp;
                                            <p className="date">{rep.date_created}</p>
                                        </div> */}
                                    </div>


                                </div>
                            ))}
                        </div>
                    </div>
                )
            }
        </div>
    )
}

export default CommentFeed