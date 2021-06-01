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





module.exports = router;
