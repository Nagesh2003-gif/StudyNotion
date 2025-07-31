const SubSection = require("../models/SubSection");
const Section = require("../models/Section");
const { uploadImageCloudinary } = require("../utils/imageUploader");

//create Subsection

exports.createSubSection = async (req, res) => {
  try {
    const { sectionId, title, timeDuration, description } = req.body;
    const video = req.files.videoFile;
    console.log("videoFile", title);
    if (!sectionId || !title || !timeDuration || !description || !video) {
      return res.status(400).json({
        success: false,
        message: "all field are required",
      });
    }

    const uploadDetails = await uploadImageCloudinary(
      video,
      process.env.FOLDER_NAME
    );

    const subSectionDetails = await SubSection.create({
      title: title,
      timeDuration: timeDuration,
      description: description,
      videoUrl: uploadDetails.secure_url,
    });

    const updatedSection = await Section.findByIdAndUpdate(
      { _id: sectionId },
      {
        $push: {
          SubSection: subSectionDetails._id,
        },
      },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Sub section created successfully",
      updatedSection,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internet Server Error",
      error: error.message,
    });
  }
};

exports.updateSubSection = async (req, res) => {
  try {
    const { title, timeDuration, description, subsectionId, video } = req.body;

    if (!subsectionId || !title || !timeDuration || !description || !video) {
      return res.status(400).json({
        success: false,
        message: "all field are required",
      });
    }

    const subSection = await SubSection.findByIdAndUpdate(
      subsectionId,
      { title, timeDuration, description, video },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "subsection updated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to update subsection , please try again",
      error: error.message,
    });
  }
};

exports.deleteSubSection = async (req, res) => {
  try {
    const { subsectionId } = req.params;
    await SubSection.findByIdAndDelete(subsectionId);
    return res.status(200).json({
      success: true,
      message: "subsection deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to delete subsection , please try again",
      error: error.message,
    });
  }
};
