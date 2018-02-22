const Project = require('../models/project');

exports.getProjects = (req, res) => {
    Project.find({}, '_id title description createdAt')
            .populate('user', '_id email firstName lastName createdAt')
            .exec((err, projects) => {
                if (!err) {
                    res.status(200).json({projects})
                } else {
                    res.status(404).send();
                }
            });
};

exports.createProject = (req, res) => {
    const project = new Project(
        {
            user: req.user,
            title: req.body.title,
            description: req.body.description
        }
    );
    project.save((error, project) => {
        if (!error){
            res.status(201).json({
                project: {
                    createdAt: project.createdAt,
                    _id: project._id,
                    title: project.title,
                    description: project.description,
                    user: {
                        _id: req.user._id,
                        email: req.user.email,
                        firstName: req.user.firstName,
                        lastName: req.user.lastName,
                        createdAt: req.user.createdAt
                    }
                }
            });
        } else {
            res.status(422).send({error});
        }
    });
};

exports.updateProject = (req, res) => {
    Project.findByIdAndUpdate(req.params.projectId,
        {$set: {title: req.body.title, description: req.body.description}},
        { new: true },
        (err, project) => {
            if (!err) {
                res.status(200).json({
                    project: {
                        createdAt: project.createdAt,
                        _id: project._id,
                        title: project.title,
                        description: project.description,
                        user: {
                            _id: req.user._id,
                            email: req.user.email,
                            firstName: req.user.firstName,
                            lastName: req.user.lastName,
                            createdAt: req.user.createdAt
                        }
                    }
                });
            } else {
                res.status(404).send();
            }
        });
};

exports.deleteProject = (req, res) => {
    Project.findByIdAndRemove(req.params.projectId, (err) => {
       if (!err) {
           res.status(200).send();
       } else {
           res.status(404).send();
       }
    });
};
