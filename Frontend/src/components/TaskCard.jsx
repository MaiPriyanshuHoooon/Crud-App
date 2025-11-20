import { taskCategories } from '../utils/constant';
import TaskView from './TaskView';

const TaskCard = ({ data }) => {

    const category = data.category;
    const categoryClass = taskCategories[category] || taskCategories['Other'];
  return (
    <>
      <div className="w-full bg-zinc-800 rounded-2xl shadow py-3 px-3 " data-aos="fade-right">
        <p className="text-3xl font-bold capitalize ">{data.title}</p>

        <p className="font-semibold text-normal text-zinc-400 py-2 bg-gray-100 rounded-2xl px-3">
          {data.description}
        </p>

        <div className="py-3 flex justify-between">
          <span className={`${categoryClass} capitalize`}>
            {category}
          </span>
        <TaskView id={data._id}/>
        </div>
      </div>
    </>
  );
};

export default TaskCard;