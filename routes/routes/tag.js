const Tag = require("../../models/tag");
const multer = require("multer");
const path = require("path");
const PORT = 3007;
const FILE_PATH  = `http://127.0.0.1:${PORT}/postimage/`;

const routes = function (app) {
    app.get('/tag', async function(req,res){
		try{
			let tag = await Tag.find().populate('post').lean()
			console.log('Populated tags with posts:', tag);
			res.json(tag)
		}catch(err){
			res.status(500).send(err.message)
		}
	});

	// app.get('/tag', async function(req, res) {
	// 	try {
	// 	  const tags = await Tag.find().populate('posts').lean();
	// 	  const tagsWithPostCount = tags.map(tag => ({
	// 		...tag,
	// 		postCount: tag.posts.length
	// 	  }));
	// 	  res.json(tagsWithPostCount);
	// 	} catch (err) {
	// 	  res.status(500).send(err.message);
	// 	}
	//   });
	  
	app.get('/tag/:id', async function(req,res){
		try{
		 let {id} = req.params
		 let tag = await Tag.findById(id).populate('post');

		 if (!tag) {
			return res.status(404).json({ msg: 'Tag not found' });
		  }
	  
		//   console.log('Fetched tag:', tag);

		 let data = {
			 title: tag.title,
			 id:tag.id,
			 post: tag.post
		 }
		 // console.log(category)
		 res.json(data)
		}catch(err){
			console.error('Error fetching tag:', err);
		    res.status(500).send({msg:"server error"})
		}
	 })

	app.put('/tag/:id', async function(req,res){
		try{
			let {id} = req.params
			let tag = await Tag.findById(id)
            let new_data = {}

            if (!tag)
            return res.status(404).json({msg: "tag does not exist", code:404});

            new_data = {...tag._doc, ...req.body};

            tag.overwrite(new_data);
            await tag.save();

            res.json(tag)
		}catch(err){
			res.status(500).send(err.message)
		}
	});
    
    app.delete('/tag/:id', async function(req,res){
		try{
			let {id} = req.params
			let tag = await Tag.findOneAndDelete({ _id: id })

			if (!tag) {
				return res.status(404).json({ msg: "Tag does not exist", code: 404 });
			  }
		  
			  res.json({ msg: "Tag deleted" });
			} catch (err) {
			  res.status(500).send(err.message);
			}
	});

	app.post('/tag', async function(req,res){
		try{
			let tag = new Tag(req.body)
			tag.post = req.body.post;
			// console.log(tag.post)
			await tag.save()
			res.json(tag)
		}catch(err){
			res.status(500).send(err.message)
		}
	})
 
}
module.exports = routes