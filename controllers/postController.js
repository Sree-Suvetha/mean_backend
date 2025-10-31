const Post = require('../models/post');

exports.createPost = async (req, res)=>{
        try{
            const protocol = req.secure? 'https':'http';
            const url = protocol + '://' + req.get('host');
            //const url = 'https://'+req.get('host'); //construct a url to server
            const post = new Post({
                title: req.body.title,
                content: req.body.content,
                imagePath: url+ "/images/" + req.file.filename, // direct access (domain+ folder+ name)
                creator: req.userData.userId
            });
            await post.save();
            res.status(201).json({message:'New post created', newPost:post});
        }
        catch(err)
        {
            res.status(500).json({message:'Post creation failed'});
        }
}

exports.getAllPosts = async (req, res)=>{
    try{
        const pageSize= +req.query.pagesize;
        const currentPage= +req.query.page;
        let postsQuery = Post.find(); // build query
        if(pageSize && currentPage)
        {
            postsQuery = postsQuery
            .skip(pageSize * (currentPage-1))
            .limit(pageSize);
        }
        const [posts, totalPosts] = await Promise.all([postsQuery, Post.countDocuments()]); //execute
        res.status(200).json({message:'post sent', posts:posts, totalPosts:totalPosts});
    }
    catch(err)
    {
        res.status(500).json({message:'Posts fetch failed'});
    }
}

exports.getSpecificPost = async(req, res)=>{
    try{
        const post = await Post.findById(req.params.id);
        res.status(200).json(post);
    }
    catch(err){
        res.status(500).json({message:'Cannot get the post'});
    }
}

exports.deletePost = async(req, res)=>{
    try{
        const deletedPost = await Post.findOneAndDelete({_id:req.params.id, creator: req.userData.userId});
        if(!deletedPost)
        {
            res.status(401).json({message:'Unauthorized user - cannot delete posts created by others'})
        }
        else
        {
            res.status(200).json({message:'Post deleted successfully'});
        }
    }
    catch(err)
    {
        res.status(500).json({message: 'Post deletion failed'});
    }
}

exports.updatePost = async(req, res)=>{
    try{
        let imagePath = req.body.imagePath;
        if(req.file)
        {
            const protocol = req.secure? 'https':'http';
            const url = protocol + '://' + req.get('host');
            //const url = req.protocol+"://"+req.get('host');
            imagePath= url+ "/images/" + req.file.filename // direct access (domain+ folder+ name)

        }
        const post = await Post.findOneAndUpdate(
            {_id:req.params.id, creator:req.userData.userId}, //condition
            {                               // new post updates
                title:req.body.title, 
                content:req.body.content, 
                imagePath:req.body.imagePath 
            }, 
            {new:true});
        if(!post)
        {
            res.status(401).json({message:'Unauthorized user - cannot edit posts created by others'})
        }
        else
        {
            res.status(200).json({message:'Post updated'})
        }
    }
    catch(err)
    {
        res.status(500).json({message: 'Post updation failed'});
    }
}

