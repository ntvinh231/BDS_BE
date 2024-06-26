import mongoose from 'mongoose';
import mongoose_delete from 'mongoose-delete';

const typeSchemna = new mongoose.Schema(
	{
		name: { type: String },
	},
	{
		timestamps: true,
	}
);

const type = mongoose.model('Type', typeSchemna);

export default type;
