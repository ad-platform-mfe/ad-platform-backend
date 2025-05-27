<template>
  <div class="home-container">
    <el-container>
      <el-header>
        <el-menu
          :default-active="activeIndex"
          class="el-menu-demo"
          mode="horizontal"
          @select="handleSelect"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
        >
          <el-menu-item index="1">客户管理</el-menu-item>
          <el-menu-item index="2">设备管理</el-menu-item>
          <el-menu-item index="3">广告内容</el-menu-item>
          <el-menu-item index="4">播放排期</el-menu-item>
          <el-menu-item index="5">播放日志</el-menu-item>
        </el-menu>
      </el-header>
      <el-main>
        <div v-if="activeIndex === '1'">
          <h2>客户管理</h2>
          <el-table :data="usersData" style="width: 100%">
            <el-table-column prop="id" label="ID" width="80"></el-table-column>
            <el-table-column
              prop="username"
              label="用户名"
            ></el-table-column>
            <el-table-column prop="password" label="密码"></el-table-column>
            <el-table-column prop="phone" label="联系电话"></el-table-column>
            <el-table-column prop="email" label="电子邮箱"></el-table-column>
            <el-table-column
              prop="create_time"
              label="创建时间"
            ></el-table-column>
            <el-table-column prop="status" label="状态"></el-table-column>
            <el-table-column label="操作" width="180">
              <template slot-scope="scope">
                <el-button size="mini" @click="handleEdit(scope.row)"
                  >编辑</el-button
                >
                <el-button
                  size="mini"
                  type="danger"
                  @click="handleDelete(scope.row)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div v-if="activeIndex === '2'">
          <h2>设备管理</h2>
          <el-table :data="deviceData" style="width: 100%">
            <el-table-column prop="id" label="ID" width="80"></el-table-column>
            <el-table-column prop="name" label="设备显示名称"></el-table-column>
            <el-table-column prop="location" label="安装位置"></el-table-column>
            <el-table-column prop="status" label="在线状态">
              <template slot-scope="scope">
                <el-tag
                  :type="scope.row.status === 'online' ? 'success' : 'danger'"
                  >{{ scope.row.status }}</el-tag
                >
              </template>
            </el-table-column>
            <el-table-column label="操作" width="180">
              <template slot-scope="scope">
                <el-button size="mini" @click="handleEdit(scope.row)"
                  >编辑</el-button
                >
                <el-button
                  size="mini"
                  type="danger"
                  @click="handleDelete(scope.row)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div v-if="activeIndex === '3'">
          <h2>广告内容</h2>
          <el-table :data="contentData" style="width: 100%">
            <el-table-column prop="id" label="ID" width="80"></el-table-column>
            <el-table-column prop="title" label="广告标题"></el-table-column>
            <el-table-column prop="file_url" label="广告存储路径"></el-table-column>
            <el-table-column
              prop="text"
              label="文字内容"
            ></el-table-column>
            <el-table-column
              prop="type"
              label="广告类型"
            ></el-table-column>
            <el-table-column
              prop="upload_time"
              label="上传时间"
            ></el-table-column>
            <el-table-column label="操作" width="180">
              <template slot-scope="scope">
                <el-button size="mini" @click="handleEdit(scope.row)"
                  >编辑</el-button
                >
                <el-button
                  size="mini"
                  type="danger"
                  @click="handleDelete(scope.row)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div v-if="activeIndex === '4'">
          <h2>播放排期</h2>
          <el-table :data="scheduleData" style="width: 100%">
            <el-table-column prop="id" label="ID" width="80"></el-table-column>
            <el-table-column
              prop="device_id"
              label="播放设备ID"
            ></el-table-column>
            <el-table-column
              prop="content_id"
              label="广告内容ID"
            ></el-table-column>
            <el-table-column
              prop="start_time"
              label="开始播放时间"
            ></el-table-column>
            <el-table-column
              prop="end_time"
              label="结束播放时间"
            ></el-table-column>
            <el-table-column
              prop="play_mode"
              label="播放模式"
            ></el-table-column>
            <el-table-column
              prop="is_available"
              label="可否选择"
            >
              <template slot-scope="scope">
                <el-tag :type="scope.row.is_available === '是' ? 'success' : 'danger'">
                  {{ scope.row.is_available }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column
              prop="price"
              label="价格"
            ></el-table-column>
            <el-table-column label="操作" width="180">
              <template slot-scope="scope">
                <el-button size="mini" @click="handleEdit(scope.row)"
                  >编辑</el-button
                >
                <el-button
                  size="mini"
                  type="danger"
                  @click="handleDelete(scope.row)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div v-if="activeIndex === '5'">
          <h2>播放日志</h2>
          <el-table :data="playLogData" style="width: 100%">
            <el-table-column prop="id" label="ID" width="80"></el-table-column>
            <el-table-column prop="username" label="用户名"></el-table-column>
            <el-table-column prop="content_title" label="广告标题"></el-table-column>
            <el-table-column prop="device_name" label="设备名称"></el-table-column>
            <el-table-column prop="schedule_start_time" label="开始播放时间"></el-table-column>
            <el-table-column prop="schedule_end_time" label="结束播放时间"></el-table-column>
            <el-table-column label="操作" width="180">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="danger"
                  @click="handleDelete(scope.row)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-main>
    </el-container>

    <el-dialog
      :title="
        activeIndex === '1'
          ? '编辑客户信息'
          : activeIndex === '2'
          ? '编辑设备信息'
          : '编辑广告内容'
      "
      :visible.sync="dialogVisible"
      width="50%"
    >
      <el-form :model="editForm" label-width="120px">
        <el-form-item label="用户名" v-if="activeIndex === '1'">
          <el-input v-model="editForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" v-if="activeIndex === '1'">
          <el-input v-model="editForm.password"></el-input>
        </el-form-item>
        <el-form-item label="联系电话" v-if="activeIndex === '1'">
          <el-input v-model="editForm.phone"></el-input>
        </el-form-item>
        <el-form-item label="电子邮箱" v-if="activeIndex === '1'">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="状态" v-if="activeIndex === '1'">
          <el-select v-model="editForm.status" placeholder="请选择">
            <el-option label="启用" value="启用"></el-option>
            <el-option label="禁用" value="禁用"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="安装位置" v-if="activeIndex === '2'">
          <el-input v-model="editForm.location"></el-input>
        </el-form-item>
        <el-form-item label="状态" v-if="activeIndex === '2'">
          <el-select v-model="editForm.status" placeholder="请选择">
            <el-option label="启用" value="online"></el-option>
            <el-option label="禁用" value="offline"></el-option>
            <el-option label="维修中" value="maintenance"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="广告标题" v-if="activeIndex === '3'">
          <el-input v-model="editForm.title"></el-input>
        </el-form-item>
        <el-form-item label="广告内容" v-if="activeIndex === '3'">
          <el-input v-model="editForm.file_url"></el-input>
        </el-form-item>
        <el-form-item label="文字内容" v-if="activeIndex === '3'">
          <el-input v-model="editForm.text"></el-input>
        </el-form-item>
        <el-form-item label="广告类型" v-if="activeIndex === '3'">
          <el-select v-model="editForm.type" placeholder="请选择"></el-select>
            <el-option label="图片" value="图片"></el-option>
            <el-option label="视频" value="视频"></el-option>
            <el-option label="文字" value="文字"></el-option>
        </el-form-item>
        <el-form-item label="播放开始时间" v-if="activeIndex === '4'">
          <el-date-picker
            v-model="editForm.start_time"
            type="datetime"
            placeholder="选择开始时间"
            value-format="yyyy-MM-dd HH:mm:ss"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="播放结束时间" v-if="activeIndex === '4'">
          <el-date-picker
            v-model="editForm.end_time"
            type="datetime"
            placeholder="选择结束时间"
            value-format="yyyy-MM-dd HH:mm:ss"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="模式" v-if="activeIndex === '4'">
          <el-select v-model="editForm.play_mode" placeholder="请选择">
            <el-option label="定时" value="定时"></el-option>
            <el-option label="循环" value="循环"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="可否选择" v-if="activeIndex === '4'">
          <el-select v-model="editForm.is_available" placeholder="请选择">
            <el-option label="是" value="是"></el-option>
            <el-option label="否" value="否"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="价格" v-if="activeIndex === '4'">
          <el-input-number v-model="editForm.price" :precision="2" :step="0.1" :min="0"></el-input-number>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitEdit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      activeIndex: "1",
      usersData: [],
      deviceData: [],
      contentData: [],
      scheduleData: [],
      playLogData: [],
      dialogVisible: false,
      editForm: {
        start_time: "",
        end_time: "",
        is_available: "是",
        price: 0,
      },
    };
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    async fetchData() {
      try {
        const [usersRes, devicesRes, contentsRes, scheduleRes, playLogRes] =
          await Promise.all([
            axios.get("http://localhost:3030/api/users"),
            axios.get("http://localhost:3030/api/device"),
            axios.get("http://localhost:3030/api/content"),
            axios.get("http://localhost:3030/api/schedule"),
            axios.get("http://localhost:3030/api/play_log"),
          ]);

        if (usersRes.data.code === 200) {
          this.usersData = usersRes.data.data;
        }
        if (devicesRes.data.code === 200) {
          this.deviceData = devicesRes.data.data;
        }
        if (contentsRes.data.code === 200) {
          this.contentData = contentsRes.data.data;
        }
        if (scheduleRes.data.code === 200) {
          this.scheduleData = scheduleRes.data.data;
        }
        if (playLogRes.data.code === 200) {
          this.playLogData = playLogRes.data.data;
        }
      } catch (error) {
        console.error("获取数据失败:", error);
      }
    },
    handleSelect(key) {
      this.activeIndex = key;
    },
    async handleEdit(row) {
      this.editForm = JSON.parse(JSON.stringify(row));
      if (this.activeIndex === "4") {
        if (this.editForm.start_time) {
          this.editForm.start_time = new Date(this.editForm.start_time);
        }
        if (this.editForm.end_time) {
          this.editForm.end_time = new Date(this.editForm.end_time);
        }
      }
      this.dialogVisible = true;
    },
    async submitEdit() {
      try {
        let endpoint = "";
        switch (this.activeIndex) {
          case "1":
            endpoint = `/api/users/${this.editForm.id}`;
            break;
          case "2":
            endpoint = `/api/device/${this.editForm.id}`;
            break;
          case "3":
            endpoint = `/api/content/${this.editForm.id}`;
            break;
          case "4":
            endpoint = `/api/schedule/${this.editForm.id}`;
            break;
        }

        const response = await axios.put(
          `http://localhost:3030${endpoint}`,
          this.editForm
        );
        if (response.data.code === 200) {
          this.$message.success("修改成功");
          this.dialogVisible = false;
          await this.fetchData();
        } else {
          this.$message.error(response.data.message || "修改失败");
        }
      } catch (error) {
        console.error("修改失败:", error);
        this.$message.error("修改失败，请稍后重试");
      }
    },
    async handleDelete(row) {
      try {
        let endpoint = "";
        switch (this.activeIndex) {
          case "1":
            endpoint = `/api/users/${row.id}`;
            break;
          case "2":
            endpoint = `/api/device/${row.id}`;
            break;
          case "3":
            endpoint = `/api/content/${row.id}`;
            break;
          case "4":
            endpoint = `/api/schedule/${row.id}`;
            break;
          case "5":
            endpoint = `/api/play_log/${row.id}`;
            break;
        }

        const response = await axios.delete(`http://localhost:3030${endpoint}`);
        if (response.data.code === 200) {
          this.$message.success("删除成功");
          await this.fetchData();
        } else {
          this.$message.error(response.data.message || "删除失败");
        }
      } catch (error) {
        console.error("删除失败:", error);
        this.$message.error("删除失败，请稍后重试");
      }
    },
    async handleAdd() {
      
    },
  },
};
</script>

<style>
.home-container {
  height: 100vh;
}
.el-header {
  padding: 0;
}
.el-main {
  padding: 20px;
}
h2 {
  margin-bottom: 20px;
}
</style>