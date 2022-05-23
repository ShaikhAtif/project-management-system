import httpCodes from "../config/httpCodes.js";
import generalMessages from "../config/generalMessages.js";
import ApiError from "../utils/ApiError.js";
import errorHandler from "../utils/errorHandler.js";
import PrismaPackage from "@prisma/client";

const { PrismaClient } = PrismaPackage;
const prisma = new PrismaClient();

export const create = async (req, res, next) => {
  try {
    const { surveyTitle, instructions, otherInfo } = req.body;

    const survey = await prisma.survey.create({
      data: {
        surveyTitle,
        instructions,
        otherInfo,
      },
    });

    // Todo: Create many questions sent from the client (not doing it now)
    // const questions = await prisma.question.createMany()

    res.status(httpCodes.created).json({
      survey,
      meesage: `Survey ${generalMessages.created}`,
    });
  } catch (err) {
    res.send(errorHandler(err, "Survey"));
  }
};

export const get = async (req, res, next) => {
  try {
    const studentId = parseInt(req.params.id);

    const student = await prisma.student.findUnique(
      {
        where : {id: studentId}
      }
    );
    res.status(httpCodes.ok).json({
      student,
      message: `Survey ${generalMessages.retrieved}`,
    });
  } catch (err) {
    res.send(errorHandler(err));
  }
};
