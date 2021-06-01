// implement your posts router here
const router = require("express").Router();

const Post = require("./posts-model");

router.get("/", (req, res) => {
  Post.find()
    .then((post) => {
      res.status(200).json(post);
    })
    .catch((error) => {
      console.log(error);
      res
        .status(500)
        .json({ message: "The post information could not be retrieved" });
    });
});

router.get("/:id", (req, res) => {
  Post.findById(req.params.id)
    .then((post) => {
      if (post) {
        res.status(200).json(post);
      } else {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist" });
      }
    })
    .catch((error) => {
      console.log(error);
      res
        .status(500)
        .json({ message: "The post information could not be retrieved" });
    });
});

router.get("/:id/comments", (req, res) => {
  const { id } = req.params;
  Post.findById(id)
    .then((post) => {
      if (!post) {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist" });
      } else {
        return Post.findPostComments(id);
      }
    })

    .then((comments) => {
      if (comments) {
        res.status(200).json(comments);
      }
    })
    .catch((error) => {
      console.log(error);
      res
        .status(500)
        .json({ message: "The comments information could not be retrieved" });
    });
});

router.post("/", (req, res) => {
    const body = req.body
    if(!body.title || !body.contents){
        res.status(400).json({ message: "Please require title and contents for the post"})
    }else{
        Post.insert(body)
      .then(({id}) => {
return Post.findById(id)
      })
      .then((post) => res.status(201).json(post))
      .catch((error) => {
console.log(error)
res.status(500).json({message:"There was an error while saving the post to the database"})
      })
    }

})


router.put("/:id", (req, res)=> {
    const changes = req.body
    const {id} = req.params
    if(!changes.title || !changes.contents){
     res.status(400).json({message:"Please provide title and contents for the post"})
    }else{
        Post.update(id,changes)
        .then((post)=> {
            if(!post){
           res.status(404).json({message:"The post with the specified ID does not exist" })
            }else{
                return Post.findById(id)
            }
        })
        .then((post) => res.json(post))
        .catch((error) => {
            console.log(error)
            res.status(500).json({message:"The post information could not be modified"})
        })
    }
})


router.delete("/:id", (req, res) => {
    const {id} = req.params
    Post.findById(id)
    .then((post)=> {
        if(!post){
            res.status(404).json({message:"The post with the specified ID does not exist"})
        }else{
            res.json(post)
            return Post.remove(id)
        }
    })
    .catch((error) => {
        console.log(error)
        res.status(500).json({message:"The post could not be removed"})
    })
})




module.exports = router;
